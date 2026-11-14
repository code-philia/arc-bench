// requirement: REQ-5.7.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, field, login, orders } from './helpers';
import { history } from './fixtures/data';

test("REQ-5.7.1: Open historical-order filters", async ({ page }) => {
  await entry(page);
  await login(page, history.username);
  await orders(page, 'History orders');
  for (const name of ['Order date type', 'Start date', 'End date']) await expect(field(page, name)).toBeVisible();
  await expect(button(page, 'Search')).toBeVisible();
});
