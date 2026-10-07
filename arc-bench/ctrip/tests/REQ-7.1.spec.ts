// requirement: REQ-7.1
import { test, expect } from "@playwright/test";
import { radio, flight, visible, heading, openHome, installClock, openStatus } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.1: Open flight status service', async ({ page }, testInfo) => {
  await openHome(page);
  await openStatus(page);
  await heading(page, 'Flight status');
  await visible(radio(page, 'Flight number'));
  await visible(radio(page, 'Route'));
});

