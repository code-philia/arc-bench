// requirement: REQ-8.1
import { expect } from "@playwright/test";
import { test, openHome, openVouchers, tab, region, registerAccount } from './helpers';

test("REQ-8.1: Open reimbursement service entry", async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openVouchers(page);
  for (const name of ['Pending', 'In progress', 'Completed']) await expect(tab(page, name)).toBeVisible();
  await expect(region(page, 'Issuance rules')).toBeVisible();
});
