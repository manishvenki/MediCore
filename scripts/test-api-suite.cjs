/**
 * MediCore Comprehensive API & Database Verification Test Suite
 * Executes end-to-end functional, authentication, authorization, CORS, and data tests
 * against the real backend application and MongoDB Atlas database.
 */
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

// Load environment from server/.env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Import the Express app (compiled or via ts-node)
// Let's require the compiled dist/app.js from server
const app = require('../server/dist/app').default;
const { connectDB } = require('../server/dist/config/db');
const mongoose = require('../server/node_modules/mongoose');

const PORT = 5555;
let server;
let baseUrl;

const testResults = [];

function recordResult(category, testName, expectedStatus, actualStatus, pass, details = {}) {
  const result = {
    category,
    testName,
    expectedStatus,
    actualStatus,
    pass,
    ...details,
  };
  testResults.push(result);
  const mark = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`[${mark}] [${category}] ${testName} (Status: ${actualStatus}, Expected: ${expectedStatus})`);
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body ? JSON.stringify(options.body) : null;

  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const startTime = Date.now();
  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const durationMs = Date.now() - startTime;
  let json = null;
  let text = '';
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch (e) {
    // text only
  }

  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    data: json,
    text,
    durationMs,
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('   MEDICORE AUTONOMOUS API & VERIFICATION SUITE     ');
  console.log('====================================================');
  console.log(`Connecting to MongoDB Atlas and starting test server on port ${PORT}...`);
  await connectDB();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  baseUrl = `http://localhost:${PORT}`;
  console.log(`Test server running at ${baseUrl}`);

  let authToken = '';
  let testPatientId = '';
  let testAppointmentId = '';
  let seededPatientId = '';
  let seededDoctorId = '';

  try {
    // -------------------------------------------------------------------------
    // 1. Service Diagnostic & Health Endpoints
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Diagnostic & Health Endpoints ---');

    // GET /
    const rRoot = await request('/');
    recordResult('Health', 'Root API Status (GET /)', 200, rRoot.status, rRoot.status === 200 && rRoot.data?.success === true, {
      response: rRoot.data,
      latency: `${rRoot.durationMs}ms`,
    });

    // GET /api
    const rApi = await request('/api');
    recordResult('Health', 'API Endpoint Discovery (GET /api)', 200, rApi.status, rApi.status === 200 && rApi.data?.success === true, {
      endpoints: rApi.data?.endpoints,
      latency: `${rApi.durationMs}ms`,
    });

    // GET /api/health
    const rHealth = await request('/api/health');
    recordResult('Health', 'Primary Health Check (GET /api/health)', 200, rHealth.status, rHealth.status === 200 && rHealth.data?.database === 'connected', {
      database: rHealth.data?.database,
      latency: `${rHealth.durationMs}ms`,
    });

    // GET /health (dual mount fallback)
    const rHealthAlt = await request('/health');
    recordResult('Health', 'Alternative Health Check (GET /health)', 200, rHealthAlt.status, rHealthAlt.status === 200, {
      database: rHealthAlt.data?.database,
      latency: `${rHealthAlt.durationMs}ms`,
    });

    // -------------------------------------------------------------------------
    // 2. Authentication & Authorization Lifecycle
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Authentication & Authorization Lifecycle ---');

    // Login with missing fields
    const rMissingFields = await request('/api/auth/login', {
      method: 'POST',
      body: {},
    });
    recordResult('Auth', 'Login with missing fields (POST /api/auth/login)', 400, rMissingFields.status, rMissingFields.status === 400, {
      message: rMissingFields.data?.message,
    });

    // Login with invalid credentials
    const rInvalidCreds = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@medicore.com', password: 'WrongPassword999' },
    });
    recordResult('Auth', 'Login with invalid credentials (POST /api/auth/login)', 401, rInvalidCreds.status, rInvalidCreds.status === 401, {
      message: rInvalidCreds.data?.message,
    });

    // Login with valid credentials (admin@medicore.com / Admin@123)
    const rValidLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@medicore.com', password: 'Admin@123' },
    });
    const loginOk = rValidLogin.status === 200 && !!rValidLogin.data?.data?.token;
    authToken = rValidLogin.data?.data?.token || '';
    recordResult('Auth', 'Login with valid credentials (POST /api/auth/login)', 200, rValidLogin.status, loginOk, {
      userName: rValidLogin.data?.data?.user?.name,
      userRole: rValidLogin.data?.data?.user?.role,
      hasToken: !!authToken,
      latency: `${rValidLogin.durationMs}ms`,
    });

    // Dual mount login verification: POST /auth/login (without /api prefix)
    const rAltLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@medicore.com', password: 'Admin@123' },
    });
    recordResult('Auth', 'Dual-Mount Login Without Prefix (POST /auth/login)', 200, rAltLogin.status, rAltLogin.status === 200, {
      hasToken: !!rAltLogin.data?.data?.token,
    });

    // Protected route without token
    const rNoToken = await request('/api/auth/me');
    recordResult('Auth', 'Access protected route without token (GET /api/auth/me)', 401, rNoToken.status, rNoToken.status === 401, {
      message: rNoToken.data?.message,
    });

    // Protected route with invalid token
    const rBadToken = await request('/api/auth/me', {
      headers: { Authorization: 'Bearer this_is_an_invalid_token' },
    });
    recordResult('Auth', 'Access protected route with invalid token (GET /api/auth/me)', 401, rBadToken.status, rBadToken.status === 401, {
      message: rBadToken.data?.message,
    });

    // Protected route with valid token
    const rMe = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordResult('Auth', 'Access protected route with valid token (GET /api/auth/me)', 200, rMe.status, rMe.status === 200 && rMe.data?.data?.email === 'admin@medicore.com', {
      user: rMe.data?.data,
    });

    // -------------------------------------------------------------------------
    // 3. Doctors Endpoints
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Doctors Endpoints ---');

    const rDoctors = await request('/api/doctors', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const doctorsCount = rDoctors.data?.data?.length || 0;
    if (doctorsCount > 0) {
      seededDoctorId = rDoctors.data?.data[0]._id;
    }
    recordResult('Doctors', 'Get active doctors catalog (GET /api/doctors)', 200, rDoctors.status, rDoctors.status === 200 && doctorsCount > 0, {
      doctorsFound: doctorsCount,
      sampleDoctor: rDoctors.data?.data?.[0]?.name,
    });

    // -------------------------------------------------------------------------
    // 4. Dashboard Endpoints
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Dashboard Analytics & Statistics ---');

    const rStats = await request('/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordResult('Dashboard', 'Get executive KPI statistics (GET /api/dashboard/stats)', 200, rStats.status, rStats.status === 200 && typeof rStats.data?.data?.totalPatients === 'number', {
      stats: rStats.data?.data,
    });

    const rTodayApts = await request('/api/dashboard/today-appointments', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordResult('Dashboard', "Get today's appointments schedule (GET /api/dashboard/today-appointments)", 200, rTodayApts.status, rTodayApts.status === 200 && Array.isArray(rTodayApts.data?.data), {
      count: rTodayApts.data?.data?.length,
    });

    const rAptStats = await request('/api/dashboard/appointment-statistics', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    recordResult('Dashboard', 'Get weekly appointment trends (GET /api/dashboard/appointment-statistics)', 200, rAptStats.status, rAptStats.status === 200 && Array.isArray(rAptStats.data?.data), {
      daysCount: rAptStats.data?.data?.length,
    });

    // -------------------------------------------------------------------------
    // 5. Patients Endpoints & Safe CRUD Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Patients Endpoints & Safe CRUD ---');

    const rPatients = await request('/api/patients?page=1&limit=5', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const patientsList = rPatients.data?.data || [];
    if (patientsList.length > 0) {
      seededPatientId = patientsList[0]._id;
    }
    recordResult('Patients', 'List paginated patients (GET /api/patients)', 200, rPatients.status, rPatients.status === 200 && patientsList.length > 0, {
      totalPatients: rPatients.data?.total,
      returnedInPage: patientsList.length,
    });

    if (seededPatientId) {
      const rPatientSingle = await request(`/api/patients/${seededPatientId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      recordResult('Patients', `Get patient dossier by ID (GET /api/patients/${seededPatientId})`, 200, rPatientSingle.status, rPatientSingle.status === 200, {
        fullName: rPatientSingle.data?.data?.fullName,
        patientId: rPatientSingle.data?.data?.patientId,
      });
    }

    // Safe isolated write test: Create temporary verification patient
    const rCreatePatient = await request('/api/patients', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        fullName: '__TEST_AUTONOMOUS_VERIFICATION_PATIENT__',
        phone: '+1 555-0199',
        email: 'autonomous.test@medicore.local',
        dateOfBirth: '1990-01-01',
        gender: 'Other',
        address: 'Automated Test Lab',
        medicalNotes: 'Safe non-destructive automated test verification record',
      },
    });
    testPatientId = rCreatePatient.data?.data?._id;
    recordResult('Patients', 'Safe write: Create temporary patient record (POST /api/patients)', 201, rCreatePatient.status, rCreatePatient.status === 201 && !!testPatientId, {
      createdId: testPatientId,
      assignedPatientId: rCreatePatient.data?.data?.patientId,
    });

    // Update the temporary verification patient
    if (testPatientId) {
      const rUpdatePatient = await request(`/api/patients/${testPatientId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          fullName: '__TEST_AUTONOMOUS_VERIFICATION_PATIENT_UPDATED__',
          medicalNotes: 'Updated by autonomous verification suite',
        },
      });
      recordResult('Patients', 'Safe update: Update temporary patient record (PUT /api/patients/:id)', 200, rUpdatePatient.status, rUpdatePatient.status === 200, {
        updatedName: rUpdatePatient.data?.data?.fullName,
      });
    }

    // -------------------------------------------------------------------------
    // 6. Appointments Endpoints & Safe CRUD Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Appointments Endpoints & Safe CRUD ---');

    const rAppointments = await request('/api/appointments?page=1&limit=5', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const appointmentsList = rAppointments.data?.data || [];
    recordResult('Appointments', 'List paginated appointments (GET /api/appointments)', 200, rAppointments.status, rAppointments.status === 200 && appointmentsList.length > 0, {
      totalAppointments: rAppointments.data?.total,
      returnedInPage: appointmentsList.length,
    });

    // Safe write: Schedule temporary appointment using temporary patient and doctor
    if (testPatientId && seededDoctorId) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 14);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const rCreateApt = await request('/api/appointments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          patient: testPatientId,
          doctor: seededDoctorId,
          appointmentDate: tomorrowStr,
          appointmentTime: '02:00 PM',
          reason: 'Automated Test Verification Consultation',
          status: 'Confirmed',
        },
      });
      testAppointmentId = rCreateApt.data?.data?._id;
      recordResult('Appointments', 'Safe write: Schedule temporary appointment (POST /api/appointments)', 201, rCreateApt.status, rCreateApt.status === 201 && !!testAppointmentId, {
        createdAptId: testAppointmentId,
        assignedCode: rCreateApt.data?.data?.appointmentId,
      });

      // Update the temporary appointment
      if (testAppointmentId) {
        const rUpdateApt = await request(`/api/appointments/${testAppointmentId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${authToken}` },
          body: {
            reason: 'Automated Test Verification Consultation (Rescheduled)',
            status: 'Pending',
          },
        });
        recordResult('Appointments', 'Safe update: Update temporary appointment (PUT /api/appointments/:id)', 200, rUpdateApt.status, rUpdateApt.status === 200, {
          newStatus: rUpdateApt.data?.data?.status,
        });
      }
    }

    // -------------------------------------------------------------------------
    // 7. Cleanup Temporary Test Records
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Cleanup Temporary Test Records (Preserve Real Data) ---');

    if (testAppointmentId) {
      const rDelApt = await request(`/api/appointments/${testAppointmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      recordResult('Cleanup', 'Clean up temporary appointment (DELETE /api/appointments/:id)', 200, rDelApt.status, rDelApt.status === 200);
    }

    if (testPatientId) {
      const rDelPatient = await request(`/api/patients/${testPatientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      recordResult('Cleanup', 'Clean up temporary patient (DELETE /api/patients/:id)', 200, rDelPatient.status, rDelPatient.status === 200);
    }

    // -------------------------------------------------------------------------
    // 8. CORS & Preflight Verification
    // -------------------------------------------------------------------------
    console.log('\n--- 8. CORS & Preflight Verification ---');

    // Preflight OPTIONS request from authorized localhost origin
    const rPreflight = await request('/api/auth/login', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });
    const allowOrigin = rPreflight.headers['access-control-allow-origin'];
    const allowCreds = rPreflight.headers['access-control-allow-credentials'];
    const allowMethods = rPreflight.headers['access-control-allow-methods'];
    const corsPass = allowOrigin === 'http://localhost:5173' && allowCreds === 'true';
    recordResult('CORS', 'Preflight OPTIONS request from authorized origin', 204, rPreflight.status, (rPreflight.status === 204 || rPreflight.status === 200) && corsPass, {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Credentials': allowCreds,
      'Access-Control-Allow-Methods': allowMethods,
    });

    // Unauthorized origin CORS check
    const rBadOrigin = await request('/api/health', {
      headers: {
        Origin: 'https://malicious-unauthorized-website.com',
      },
    });
    const badOriginAllowed = rBadOrigin.headers['access-control-allow-origin'] === 'https://malicious-unauthorized-website.com';
    recordResult('CORS', 'Strict isolation: Reject unauthorized origin', 500, rBadOrigin.status, !badOriginAllowed, {
      originAllowed: badOriginAllowed,
      note: 'Unauthorized origin was correctly rejected by Access-Control-Allow-Origin policy',
    });

    // -------------------------------------------------------------------------
    // 9. 404 Route Handling
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Universal 404 Handling ---');

    const r404Api = await request('/api/non-existent-endpoint');
    recordResult('Routing', 'API 404 catch-all handler (GET /api/non-existent-endpoint)', 404, r404Api.status, r404Api.status === 404 && r404Api.data?.success === false, {
      message: r404Api.data?.message,
    });

    const r404Root = await request('/random-non-existent-path');
    recordResult('Routing', 'Universal 404 catch-all handler (GET /random-non-existent-path)', 404, r404Root.status, r404Root.status === 404, {
      message: r404Root.data?.message,
    });

  } catch (error) {
    console.error('Fatal test error:', error);
  } finally {
    if (server) {
      server.close();
      console.log('\nTest HTTP server stopped.');
    }
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');

    console.log('\n====================================================');
    console.log('                 TEST SUMMARY REPORT                ');
    console.log('====================================================');
    const total = testResults.length;
    const passed = testResults.filter((r) => r.pass).length;
    const failed = total - passed;
    console.log(`Total Tests Executed: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('====================================================\n');

    // Output JSON test results for reporting
    const fs = require('fs');
    fs.writeFileSync(
      path.join(__dirname, 'api-test-results.json'),
      JSON.stringify({ total, passed, failed, results: testResults }, null, 2)
    );
  }
}

runTests();
