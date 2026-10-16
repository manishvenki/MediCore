/**
 * MediCore Autonomous Cross-Browser & Multi-Viewport Verification Suite
 * Executes end-to-end user workflows across Chromium, Firefox, and WebKit
 * testing Responsive Layouts (Desktop, Tablet, Mobile), Authentication,
 * Routing, API Communication, CORS, and State Persistence.
 */
const { chromium, firefox, webkit } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const app = require('../server/dist/app').default;
const { connectDB } = require('../server/dist/config/db');
const mongoose = require('../server/node_modules/mongoose');

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 5173;
const SCREENSHOTS_BASE = path.join(__dirname, '../screenshots/cross-browser');

const viewports = {
  desktop: { width: 1440, height: 900, name: 'Desktop (1440x900)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (768x1024)' },
  mobile: { width: 390, height: 844, name: 'Mobile (390x844)' },
};

const browserEngines = [
  { name: 'Chromium', engine: chromium, key: 'chromium' },
  { name: 'Firefox', engine: firefox, key: 'firefox' },
  { name: 'WebKit', engine: webkit, key: 'webkit' },
];

const crossBrowserMatrix = [];

function recordResult(browser, viewport, testName, pass, details = '') {
  crossBrowserMatrix.push({
    browser,
    viewport,
    testName,
    pass,
    details,
  });
  const mark = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`  [${mark}] [${browser}] [${viewport}] ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function run() {
  console.log('====================================================');
  console.log('   MEDICORE AUTONOMOUS CROSS-BROWSER TEST SUITE     ');
  console.log('====================================================');

  if (!fs.existsSync(SCREENSHOTS_BASE)) {
    fs.mkdirSync(SCREENSHOTS_BASE, { recursive: true });
  }

  // 1. Start Backend on port 5000
  console.log('Starting Backend Server on port 5000 connected to MongoDB Atlas...');
  await connectDB();
  const backendServer = http.createServer(app);
  await new Promise((resolve) => backendServer.listen(BACKEND_PORT, resolve));
  console.log(`Backend Server operational at http://localhost:${BACKEND_PORT}`);

  // 2. Start Frontend preview server on port 5173
  console.log('Launching Vite preview server for client on port 5173...');
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const previewProcess = spawn(
    npxCmd,
    ['vite', 'preview', '--port', String(FRONTEND_PORT), '--strictPort'],
    {
      cwd: path.join(__dirname, '../client'),
      stdio: 'pipe',
      shell: true,
    }
  );

  let frontendReady = false;
  previewProcess.stdout.on('data', (d) => {
    const str = d.toString();
    if (str.includes('http://localhost:5173') || str.includes('Local:')) {
      frontendReady = true;
    }
  });

  // Wait for frontend preview server to be responsive
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${FRONTEND_PORT}`);
      if (res.status === 200) {
        frontendReady = true;
        break;
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!frontendReady) {
    console.error('Frontend preview server failed to start on port 5173!');
    backendServer.close();
    previewProcess.kill();
    process.exit(1);
  }
  console.log('Frontend preview server is ready and serving client/dist!\n');

  try {
    for (const { name: browserName, engine, key } of browserEngines) {
      console.log(`\n====================================================`);
      console.log(`  TESTING BROWSER ENGINE: ${browserName.toUpperCase()} `);
      console.log(`====================================================`);

      const engineDir = path.join(SCREENSHOTS_BASE, key);
      if (!fs.existsSync(engineDir)) {
        fs.mkdirSync(engineDir, { recursive: true });
      }

      let browser;
      try {
        browser = await engine.launch({ headless: true });
      } catch (err) {
        console.error(`Could not launch ${browserName}:`, err.message);
        recordResult(browserName, 'All', 'Browser Engine Launch', false, err.message);
        continue;
      }

      recordResult(browserName, 'Engine', 'Browser Engine Launch', true, 'Successfully launched');

      // Test Desktop, Tablet, Mobile
      for (const [vpKey, vpConfig] of Object.entries(viewports)) {
        console.log(`\n--- Viewport: ${vpConfig.name} on ${browserName} ---`);

        const context = await browser.newContext({
          viewport: { width: vpConfig.width, height: vpConfig.height },
          deviceScaleFactor: 1,
        });

        const page = await context.newPage();
        const consoleErrors = [];
        const networkErrors = [];

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        page.on('requestfailed', (req) => {
          networkErrors.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText || 'failed'}`);
        });

        try {
          // A. Load Homepage -> Redirects to /login if unauthenticated
          await page.goto(`http://localhost:${FRONTEND_PORT}/`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(1000);

          const currentUrl = page.url();
          const onLogin = currentUrl.includes('/login');
          recordResult(browserName, vpConfig.name, 'Unauthenticated Redirect to /login', onLogin, `URL: ${currentUrl}`);

          // B. Login Form Render & Input Acceptance
          const emailInput = page.locator('input[type="email"]');
          const passwordInput = page.locator('input[type="password"]');
          const submitBtn = page.locator('button[type="submit"]');

          await emailInput.waitFor({ state: 'visible', timeout: 8000 });
          await emailInput.fill('admin@medicore.com');
          await passwordInput.fill('Admin@123');

          const filledEmail = await emailInput.inputValue();
          recordResult(browserName, vpConfig.name, 'Form Input & Data Binding', filledEmail === 'admin@medicore.com');

          // Screenshot login
          await page.screenshot({ path: path.join(engineDir, `01-login-${vpKey}.png`) });

          // C. Authenticate & Redirect to Dashboard
          await submitBtn.click();
          await page.waitForURL('**/dashboard', { timeout: 15000 });
          await page.waitForTimeout(2000);

          const onDashboard = page.url().includes('/dashboard');
          recordResult(browserName, vpConfig.name, 'Authentication & Transition to Dashboard', onDashboard);

          // D. Dashboard KPIs & Content Verification
          const kpiLocator = page.locator('text=Total Registered Patients');
          await kpiLocator.waitFor({ state: 'visible', timeout: 15000 });
          const hasKpiCards = (await kpiLocator.count()) > 0;
          recordResult(browserName, vpConfig.name, 'Executive KPI Cards Render', hasKpiCards);

          // Screenshot dashboard
          await page.screenshot({ path: path.join(engineDir, `02-dashboard-${vpKey}.png`) });

          // E. Navigation to Patients Directory
          await page.goto(`http://localhost:${FRONTEND_PORT}/patients`, { waitUntil: 'domcontentloaded' });
          const patientTable = page.locator('table');
          await patientTable.waitFor({ state: 'visible', timeout: 15000 });
          const onPatients = page.url().includes('/patients');
          recordResult(browserName, vpConfig.name, 'Patients Registry Navigation & Table Render', onPatients && (await patientTable.count()) > 0);

          // Screenshot patients
          await page.screenshot({ path: path.join(engineDir, `03-patients-${vpKey}.png`) });

          // F. Navigation to Appointments
          await page.goto(`http://localhost:${FRONTEND_PORT}/appointments`, { waitUntil: 'domcontentloaded' });
          const aptTable = page.locator('table');
          await aptTable.waitFor({ state: 'visible', timeout: 15000 });
          const onAppointments = page.url().includes('/appointments');
          recordResult(browserName, vpConfig.name, 'Appointments Management Navigation & Schedule Render', onAppointments && (await aptTable.count()) > 0);

          // Screenshot appointments
          await page.screenshot({ path: path.join(engineDir, `04-appointments-${vpKey}.png`) });

          // G. Deep-Link Reload / Nested Route Refresh
          await page.reload({ waitUntil: 'domcontentloaded' });
          await page.locator('table').waitFor({ state: 'visible', timeout: 15000 });
          const reloadSucceeded = page.url().includes('/appointments') && (await page.locator('table').count() > 0);
          recordResult(browserName, vpConfig.name, 'Deep-Link Nested Route Reload (SPA State Persistence)', reloadSucceeded);

          // H. Console & Network Error Audit
          const criticalErrors = consoleErrors.filter(
            (e) => !e.includes('favicon') && !e.includes('manifest')
          );
          recordResult(browserName, vpConfig.name, 'No Critical Console Errors', criticalErrors.length === 0, `${criticalErrors.length} errors`);
          recordResult(browserName, vpConfig.name, 'No Failed Network Requests', networkErrors.length === 0, `${networkErrors.length} network failures`);

          // I. Logout Flow
          if (vpKey === 'mobile' || vpKey === 'tablet') {
            const menuBtn = page.locator('button:has(svg.lucide-menu), button[aria-label="Toggle menu"]');
            if (await menuBtn.isVisible()) {
              await menuBtn.click();
              await page.waitForTimeout(400);
            }
          }
          const logoutBtn = page.locator('button:has-text("Sign Out")');
          if (await logoutBtn.first().isVisible()) {
            await logoutBtn.first().click();
            await page.waitForURL('**/login', { timeout: 10000 });
            const loggedOut = page.url().includes('/login');
            recordResult(browserName, vpConfig.name, 'Logout & Token Cleanup', loggedOut);
          } else {
            // Direct token removal test
            await page.evaluate(() => localStorage.clear());
            await page.goto(`http://localhost:${FRONTEND_PORT}/dashboard`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1000);
            const guarded = page.url().includes('/login');
            recordResult(browserName, vpConfig.name, 'Protected Route Guarding (Token Cleared)', guarded);
          }

        } catch (pageErr) {
          console.error(`Error during ${browserName} ${vpConfig.name}:`, pageErr.message);
          recordResult(browserName, vpConfig.name, 'Complete User Flow', false, pageErr.message);
        } finally {
          await context.close();
        }
      }

      await browser.close();
    }
  } finally {
    backendServer.close();
    await mongoose.disconnect();
    previewProcess.kill();
    console.log('\nServers terminated cleanly.');

    console.log('\n====================================================');
    console.log('       CROSS-BROWSER TEST SUMMARY REPORT            ');
    console.log('====================================================');
    const total = crossBrowserMatrix.length;
    const passed = crossBrowserMatrix.filter((r) => r.pass).length;
    const failed = total - passed;
    console.log(`Total Scenarios Executed: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('====================================================\n');

    fs.writeFileSync(
      path.join(__dirname, 'cross-browser-results.json'),
      JSON.stringify({ total, passed, failed, matrix: crossBrowserMatrix }, null, 2)
    );
  }
}

run();
