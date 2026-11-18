// requirement: REQ-5.5
import { test, expect } from '@playwright/test';
import { home, action, region, checkoutSetup, paymentStep, choice, setChoice, orderConfirmationHeading, STEP } from './helpers';

test("REQ-5.5: Choose bank wire and read terms", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_invoice_user');
  await paymentStep(page, address.alias);
  const payment = region(page, 'Payment');
  await setChoice(choice(payment, 'radio', 'Bank wire'));
  await setChoice(choice(payment, 'checkbox', 'Terms and conditions'));
  await payment.getByRole('link', { name: 'Terms and conditions', exact: true }).click();
  await expect(region(page, 'Terms and conditions')).toBeVisible();
  await expect(region(page, 'Terms and conditions')).not.toHaveText(/^\s*$/);
});

test("REQ-5.5: Require terms before completion", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_invoice_user');
  await paymentStep(page, address.alias);
  const payment = region(page, 'Payment');
  await setChoice(choice(payment, 'radio', 'Bank wire'));
  const terms = choice(payment, 'checkbox', 'Terms and conditions');
  await setChoice(terms, false);
  const place = action(payment, 'Place order');
  if (await place.isEnabled()) await place.click();
  await expect(orderConfirmationHeading(page)).toHaveCount(0);
  await expect(payment).toBeVisible();
  await expect(terms).not.toBeChecked();
  await expect(region(page, 'Order summary')).toContainText(STEP);
});
