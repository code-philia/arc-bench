// requirement: REQ-8.1
import { test, expect } from '@playwright/test';
import { openHome, openVouchers, installClock, tab, region } from './helpers';

test.beforeEach(async ({ page }) => { await installClock(page); });

test("REQ-8.1: Open reimbursement service entry", async ({ page }) => {
  await openHome(page);
  await openVouchers(page, 'voucher_read');
  for (const name of ['Pending', 'In progress', 'Completed']) await expect(tab(page, name)).toBeVisible();
  await expect(region(page, 'Issuance rules')).toBeVisible();
});
