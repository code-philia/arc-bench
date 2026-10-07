// requirement: REQ-3.1
import { test, expect } from "@playwright/test";
import { button, region, textVisible, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.1: Expand airline travel reminders', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await button(region(page, 'Travel reminders'), 'Show reminder details').click();
  await textVisible(region(page, 'Travel reminders'), 'Power banks');
  await textVisible(region(page, 'Travel reminders'), 'Baggage allowance');
});

