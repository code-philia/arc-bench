// requirement: REQ-2.2
import { test, expect } from "@playwright/test";
import { field, button, dialog, tab, openHome, installClock } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.2: Exchange route cities', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Guangzhou');
  await button(page, 'Swap cities').click();
  await expect(field(page, 'Origin')).toHaveValue('Guangzhou');
  await expect(field(page, 'Destination')).toHaveValue('Chengdu');
});

test('REQ-2.2: Choose a popular origin', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Origin').click();
  await expect(tab(dialog(page, 'City selection'), 'Popular')).toHaveAttribute('aria-selected', 'true');
  await button(dialog(page, 'City selection'), 'Chengdu').click();
  await expect(field(page, 'Origin')).toHaveValue('Chengdu (CTU)');
  await expect(dialog(page, 'City selection')).toHaveCount(0);
});

test('REQ-2.2: Choose destination by pinyin group', async ({ page }, testInfo) => {
  await openHome(page);
  await field(page, 'Destination').click();
  await tab(dialog(page, 'City selection'), 'GHIJ').click();
  await button(dialog(page, 'City selection'), 'Guangzhou').click();
  await expect(field(page, 'Destination')).toHaveValue('Guangzhou (CAN)');
  await expect(dialog(page, 'City selection')).toHaveCount(0);
});

