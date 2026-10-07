// requirement: REQ-3.4
import { test, expect } from "@playwright/test";
import { field, button, dialog, visible, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.4: Open booking passenger dialog', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await button(page, 'Add passenger').click();
  await visible(dialog(page, 'Add passenger'));
  await visible(field(dialog(page, 'Add passenger'), 'Full name'));
  await visible(field(dialog(page, 'Add passenger'), 'ID number'));
});

