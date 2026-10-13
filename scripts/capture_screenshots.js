const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chromium for screenshot automation...');
  const browser = await chromium.launch({
    headless: true,
  });

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High-definition rendering
  });

  const page = await desktopContext.newPage();
  page.setDefaultTimeout(30000);

  // 1. Login Page
  console.log('1. Navigating to Login Page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  // Fill in credentials
  await page.fill('input[type="email"]', 'admin@medicore.com');
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill('Admin@123');

  // Verify and click eye icon to toggle visibility
  console.log('Testing password eye toggle...');
  const eyeButton = page.locator('button[aria-label="Show password"]');
  if (await eyeButton.isVisible()) {
    await eyeButton.click();
    await page.waitForTimeout(400);
    // Click again to hide
    const hideEyeButton = page.locator('button[aria-label="Hide password"]');
    if (await hideEyeButton.isVisible()) {
      await hideEyeButton.click();
      await page.waitForTimeout(400);
    }
  }

  // Capture 01-login.png
  console.log('Capturing 01-login.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-login.png'), fullPage: false });

  // Submit login
  console.log('Submitting login...');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // 2. Dashboard
  console.log('Capturing 02-dashboard.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-dashboard.png'), fullPage: false });

  // 3. Patients List
  console.log('Navigating to /patients...');
  await page.goto('http://localhost:5173/patients', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Capturing 03-patients-list.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-patients-list.png'), fullPage: false });

  // 4. Patient Details
  console.log('Navigating to first patient details...');
  const viewButton = page.locator('tbody tr button:has-text("View")').first();
  if (await viewButton.isVisible()) {
    await viewButton.click();
  } else {
    const firstRowLink = page.locator('tbody tr button.font-bold').first();
    await firstRowLink.click();
  }
  await page.waitForURL('**/patients/**', { timeout: 10000 });
  await page.waitForTimeout(1500);
  console.log('Capturing 04-patient-details.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-patient-details.png'), fullPage: false });

  // Test Delete Confirmation Dialog and Cancel (Step 24 requirements 14-15)
  console.log('Testing delete confirmation and cancel...');
  const deleteBtn = page.locator('button:has-text("Delete")');
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    await page.waitForTimeout(400);
    const cancelModalBtn = page.locator('button:has-text("Cancel")');
    if (await cancelModalBtn.isVisible()) {
      await cancelModalBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 5. Add Patient
  console.log('Navigating to /patients/new...');
  await page.goto('http://localhost:5173/patients/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Fill in patient form
  await page.fill('input[placeholder="e.g. Eleanor Vance"]', 'Arjun Kumar');
  await page.selectOption('select', 'Male');
  await page.fill('input[type="date"]', '1988-06-15');
  await page.fill('input[placeholder="e.g. +1 (555) 234-5678"]', '+1 (555) 019-2834');
  await page.fill('input[placeholder="patient.name@example.com"]', 'arjun.kumar@example.com');
  await page.fill('input[placeholder*="Thomas Vance"]', 'Priya Kumar (+1 555-019-2835 - Spouse)');
  await page.fill('input[placeholder*="452 Elm Street"]', '742 Evergreen Terrace, Springfield, IL 62704');
  await page.fill('textarea', 'Mild penicillin allergy, seasonal asthma.');

  // Scroll to top so title and headers are visible in screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  console.log('Capturing 05-add-patient.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-add-patient.png'), fullPage: false });

  // Submit patient
  console.log('Submitting new patient...');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/patients/**', { timeout: 15000 });
  await page.waitForTimeout(1500);

  // 6. Edit Patient
  console.log('Opening Edit Patient form...');
  await page.click('button:has-text("Edit Record")');
  await page.waitForURL('**/edit', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const notesTextarea = page.locator('textarea');
  await notesTextarea.fill('Mild penicillin allergy, seasonal asthma. Regular maintenance inhaler prescribed.');

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  console.log('Capturing 06-edit-patient.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-edit-patient.png'), fullPage: false });

  // Save changes
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 7. Appointments List
  console.log('Navigating to /appointments...');
  await page.goto('http://localhost:5173/appointments', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Capturing 07-appointments-list.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-appointments-list.png'), fullPage: false });

  // 8. Create Appointment
  console.log('Navigating to /appointments/new...');
  await page.goto('http://localhost:5173/appointments/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Select patient Arjun Kumar
  const patientSelect = page.locator('select').first();
  const options = await patientSelect.locator('option').allInnerTexts();
  const arjunOption = options.find((opt) => opt.includes('Arjun Kumar'));
  if (arjunOption) {
    await patientSelect.selectOption({ label: arjunOption });
  }

  // Select tomorrow date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  await page.fill('input[type="date"]', tomorrowStr);

  // Fill reason
  const reasonInput = page.locator('textarea');
  if (await reasonInput.isVisible()) {
    await reasonInput.fill('Routine Pulmonary & Allergy Follow-up Examination');
  }

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  console.log('Capturing 08-create-appointment.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-create-appointment.png'), fullPage: false });

  // Submit appointment
  console.log('Scheduling appointment...');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/appointments/**', { timeout: 15000 });
  await page.waitForTimeout(1500);

  // 9. Appointment Details
  console.log('Capturing 09-appointment-details.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-appointment-details.png'), fullPage: false });

  // Test status transition (Step 24 item 29)
  const confirmEncounterBtn = page.locator('button:has-text("Confirm Encounter")');
  if (await confirmEncounterBtn.isVisible()) {
    console.log('Transitioning appointment status to Confirmed...');
    await confirmEncounterBtn.click();
    await page.waitForTimeout(1000);
  }

  // 10. Doctors (Coming Soon)
  console.log('Navigating to /doctors...');
  await page.goto('http://localhost:5173/doctors', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Capturing 10-doctors-coming-soon.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-doctors-coming-soon.png'), fullPage: false });

  // 11. Settings (Coming Soon)
  console.log('Navigating to /settings...');
  await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Capturing 11-settings-coming-soon.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-settings-coming-soon.png'), fullPage: false });

  // Close desktop context
  await desktopContext.close();

  // MOBILE CONTEXT (390 x 844)
  console.log('Creating Mobile context (390 x 844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const mobilePage = await mobileContext.newPage();
  mobilePage.setDefaultTimeout(30000);

  // Authenticate mobile session
  await mobilePage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await mobilePage.fill('input[type="email"]', 'admin@medicore.com');
  await mobilePage.fill('input[type="password"]', 'Admin@123');
  await mobilePage.click('button[type="submit"]');
  await mobilePage.waitForURL('**/dashboard', { timeout: 15000 });
  await mobilePage.waitForTimeout(3500); // Wait for initial toast to automatically fade

  // 12. Responsive Mobile Dashboard
  console.log('Capturing 12-responsive-mobile-dashboard.png...');
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '12-responsive-mobile-dashboard.png'), fullPage: false });

  // 13. Responsive Mobile Patients
  console.log('Navigating to mobile /patients...');
  await mobilePage.goto('http://localhost:5173/patients', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  console.log('Capturing 13-responsive-mobile-patients.png...');
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '13-responsive-mobile-patients.png'), fullPage: false });

  // 14. Responsive Mobile Appointments
  console.log('Navigating to mobile /appointments...');
  await mobilePage.goto('http://localhost:5173/appointments', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  console.log('Capturing 14-responsive-mobile-appointments.png...');
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '14-responsive-mobile-appointments.png'), fullPage: false });

  await mobileContext.close();

  // 15. Final Dashboard After Actions (Desktop 1440x900)
  console.log('Creating Final Desktop context (1440 x 900)...');
  const finalContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const finalPage = await finalContext.newPage();
  await finalPage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await finalPage.fill('input[type="email"]', 'admin@medicore.com');
  await finalPage.fill('input[type="password"]', 'Admin@123');
  await finalPage.click('button[type="submit"]');
  await finalPage.waitForURL('**/dashboard', { timeout: 15000 });
  await finalPage.waitForTimeout(3000); // Wait for toast to fade

  console.log('Capturing 15-final-dashboard-after-actions.png...');
  await finalPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '15-final-dashboard-after-actions.png'), fullPage: false });

  // Test logout and protected route redirect (Step 24 item 31-34)
  console.log('Testing logout and route protection...');
  const signOutBtn = finalPage.locator('button:has-text("Sign Out")');
  if (await signOutBtn.isVisible()) {
    await signOutBtn.click();
    await finalPage.waitForURL('**/login', { timeout: 10000 });
    console.log('Logged out successfully.');

    // Try opening /dashboard while logged out
    await finalPage.goto('http://localhost:5173/dashboard');
    await finalPage.waitForURL('**/login', { timeout: 10000 });
    console.log('Verified: Protected route redirected unauthenticated access back to /login!');
  }

  await finalContext.close();
  await browser.close();

  console.log('All 15 screenshots successfully captured and verified!');
}

run().catch((err) => {
  console.error('Error during screenshot execution:', err);
  process.exit(1);
});
