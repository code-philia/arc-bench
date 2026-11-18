// requirement: REQ-6.2
import { test } from '@playwright/test';
import { home, registerCustomer } from './helpers';
import { customerInput } from './fixtures/data';

test("REQ-6.2: Create new customer", async ({ page }) => {
  await home(page);
  await registerCustomer(page, customerInput());
});
