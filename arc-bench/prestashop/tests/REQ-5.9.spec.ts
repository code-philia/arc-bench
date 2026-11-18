// requirement: REQ-5.9
import { test, expect } from '@playwright/test';
import { home, action, region, checkoutSetup, shippingStep, choice, STEP } from './helpers';

test("REQ-5.9: Collapse completed address step and reopen it", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP);
  await shippingStep(page, address.alias);
  const addresses = region(page, 'Addresses');
  const saved = choice(addresses, 'radio', address.alias);
  await expect(saved).toBeHidden();
  await expect(addresses).toContainText(address.Address);
  await expect(choice(region(page, 'Shipping Method'), 'radio', 'Delivery')).toBeVisible();
  await action(addresses, 'Edit Addresses').click();
  await expect(saved).toBeVisible();
  await expect(saved).toBeChecked();
  await expect(region(page, 'Order summary')).toContainText(STEP);
});
