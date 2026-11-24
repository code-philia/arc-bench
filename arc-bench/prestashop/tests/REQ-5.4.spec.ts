// requirement: REQ-5.4
import { test, expect } from '@playwright/test';
import { home, region, expectMoney, checkoutSetup, shippingStep, choice, setChoice, STEP } from './helpers';

test("REQ-5.4: Use separate invoice address", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_invoice_user');
  await setChoice(choice(region(page, 'Addresses'), 'checkbox', 'Use same address'), false);
  await expect(region(page, 'Invoice address')).toBeVisible();
  await expect(region(page, 'Invoice address')).toContainText(address.alias);
});

test("REQ-5.4: Choose Delivery", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_invoice_user');
  await shippingStep(page, address.alias);
  const shipping = region(page, 'Shipping Method');
  await expectMoney(region(shipping, 'Shipping cost'), 5);
  await setChoice(choice(shipping, 'radio', 'Delivery'));
  const summary = region(page, 'Order summary');
  await expect(summary).toContainText(STEP);
  await expectMoney(region(summary, 'Total'), 31);
});
