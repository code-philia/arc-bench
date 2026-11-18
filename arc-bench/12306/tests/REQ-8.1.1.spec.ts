// requirement: REQ-8.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { availableBookAction, bookingLoginTitle, dialog, entry, loginFields, row, search } from './helpers';

import { trains } from './fixtures/data';
test("REQ-8.1.1: Open booking quick-login entry", async ({ page }) => {
  await entry(page);
  await search(page);
  await (await availableBookAction(row(page, trains[0].number))).click();
  const quickLogin = dialog(page, bookingLoginTitle);
  await expect(quickLogin).toBeVisible();
  await expect(loginFields(quickLogin).account).toBeVisible();
  await expect(loginFields(quickLogin).password).toBeVisible();
  await expect(loginFields(quickLogin).submit).toBeVisible();
});
