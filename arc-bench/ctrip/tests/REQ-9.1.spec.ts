// requirement: REQ-9.1
import { test, expect } from "@playwright/test";
import { heading, openHome, installClock, openAirport } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-9.1: Open airport guide', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirport(page);
  await heading(page, 'Airport guide');
});

