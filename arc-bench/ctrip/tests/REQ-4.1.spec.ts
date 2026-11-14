// requirement: REQ-4.1
import { test, button, region, visible, heading, openHome, registerAccount, action } from "./helpers";

test('REQ-4.1: Open orders from account menu', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await button(page, 'My account').click();
  await visible(action(page, 'Orders'));
  await action(page, 'Orders').click();
  await heading(page, 'Orders');
  await visible(region(page, 'Order list'));
});
