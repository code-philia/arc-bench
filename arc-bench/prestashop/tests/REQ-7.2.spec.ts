// requirement: REQ-7.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, loginCustomer, loginEmail, account, field, inputForm, feedback } from './helpers';
import { customerInput } from './fixtures/data';

test("REQ-7.2: Save email then password", async ({ page }) => {
  await home(page);
  const customer = await loginCustomer(page);
  const next = customerInput();
  await account(page);
  await action(region(page, 'Account overview'), 'Information').click();
  const form = inputForm(page, ['Email', 'Current password', 'New password'], 'Save');
  await expect(field(form, 'Email')).toHaveValue(customer.email);
  await field(form, 'Current password').fill(customer.password);
  await field(form, 'Email').fill(next.email);
  await action(form, 'Save').click();
  const saved = feedback(page, 'Profile update', /saved|updated/i);
  await expect(saved).toBeVisible();
  await expect(field(form, 'Email')).toHaveValue(next.email);
  await field(form, 'Current password').fill(customer.password);
  await field(form, 'New password').fill(next.password);
  await action(form, 'Save').click();
  await expect(saved).toBeVisible();
  await action(nav(page), 'Sign out').click();
  await loginEmail(page, next.email, next.password);
  await expect(nav(page)).toContainText(customer.firstName + ' ' + customer.lastName);
});
