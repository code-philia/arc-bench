// requirement: REQ-6.2
import { test, expect } from "@playwright/test";
import { field, button, action, textVisible, openHome, installClock, openPersonal } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.2: Persist edited profile fields', async ({ page }, testInfo) => {
  await openHome(page);
  await openPersonal(page, 'profile_edit');
  await action(page, 'My information').click();
  await button(page, 'Edit').click();
  await field(page, 'Nickname').fill('Profile Editor');
  await field(page, 'Real name').fill('Wang Lin');
  await field(page, 'Gender').selectOption({ label: 'Female' });
  await field(page, 'Date of birth').fill('1992-05-16');
  await button(page, 'Save').click();
  for (const value of ['Profile Editor', 'Wang Lin', 'Female', '1992-05-16']) await textVisible(page, value);
  await page.reload();
  for (const value of ['Profile Editor', 'Wang Lin', 'Female', '1992-05-16']) await textVisible(page, value);
});

