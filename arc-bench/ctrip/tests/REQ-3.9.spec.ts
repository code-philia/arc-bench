// requirement: REQ-3.9
import { test, setChecked, button, radio, textVisible, openHome, openBooking, submitBooking, heading } from "./helpers";

test('REQ-3.9: Pay with simulated Alipay', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  await setChecked(radio(page, 'Alipay'));
  await button(page, 'Pay now').click();
  await textVisible(page, 'Payment successful');
  await textVisible(page, 'JD5162');
});
