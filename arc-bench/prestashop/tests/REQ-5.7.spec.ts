// requirement: REQ-5.7
import { test, expect } from '@playwright/test';
import { home, action, region, checkoutSetup, shippingStep, shippingAddressEdit, field, inputForm, choice, STEP } from './helpers';
import { replacementStreet } from './fixtures/data';

test("REQ-5.7: Edit shipping address during checkout", async ({ page }) => {
  await home(page);
  const address = await checkoutSetup(page, STEP, 'checkout_address_user');
  await shippingAddressEdit(page, address.alias).click();
  const form = inputForm(page, ['Alias', 'Address'], 'Save');
  const street = field(form, 'Address');
  await expect(field(form, 'Alias')).toHaveValue(address.alias);
  await expect(street).toHaveValue(address.Address);
  const replacement = replacementStreet();
  await street.fill(replacement);
  await action(form, 'Save').click();
  const addresses = region(page, 'Addresses');
  await expect(choice(addresses, 'radio', address.alias)).toBeVisible();
  await expect(addresses).toContainText(replacement);
  await expect(addresses).not.toContainText(address.Address);
  await expect(region(page, 'Order summary')).toContainText(STEP);
  await shippingStep(page, address.alias);
});
