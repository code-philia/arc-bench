// requirement: REQ-2.2
import { expect } from "@playwright/test";
import { test, expectFieldValue, field, button, dialog, tab, openHome, selectedTab } from "./helpers";

test('REQ-2.2: Exchange route cities', async ({ page }) => {
  await openHome(page);
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Guangzhou');
  await button(page, 'Swap cities').click();
  await expectFieldValue(field(page, 'Origin'), 'Guangzhou');
  await expectFieldValue(field(page, 'Destination'), 'Chengdu');
});

test('REQ-2.2: Choose a popular origin', async ({ page }) => {
  await openHome(page);
  await field(page, 'Origin').click();
  await expect(selectedTab(dialog(page, 'City selection'), 'Popular')).toBeVisible();
  await button(dialog(page, 'City selection'), 'Chengdu').click();
  await expectFieldValue(field(page, 'Origin'), 'Chengdu (CTU)');
  await expect(dialog(page, 'City selection')).toHaveCount(0);
});

test('REQ-2.2: Choose destination by pinyin group', async ({ page }) => {
  await openHome(page);
  await field(page, 'Destination').click();
  await tab(dialog(page, 'City selection'), 'GHIJ').click();
  await button(dialog(page, 'City selection'), 'Guangzhou').click();
  await expectFieldValue(field(page, 'Destination'), 'Guangzhou (CAN)');
  await expect(dialog(page, 'City selection')).toHaveCount(0);
});
