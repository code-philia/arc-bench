// requirement: REQ-6.3
import { test, expect } from '@playwright/test';
import { home, nav, action, inputForm, field, registerCustomer, feedback } from './helpers';
import { customerInput } from './fixtures/data';

test("REQ-6.3: Request existing-account reset", async ({ page }) => {
  await home(page);
  const customer = customerInput();
  await registerCustomer(page, customer);
  await action(nav(page), 'Sign out').click();
  await action(nav(page), 'Sign in').click();
  await action(page, 'Forgot your password?').click();
  const form = inputForm(page, ['Email'], 'Send');
  const email = field(form, 'Email');
  await email.fill(customer.email);
  await expect(email).toHaveValue(customer.email);
  await action(form, 'Send').click();
  const message = feedback(page, 'Password reset confirmation', /(?:sent|send).*email|email.*(?:sent|send)/i);
  await expect(message).toContainText(customer.email);
});
