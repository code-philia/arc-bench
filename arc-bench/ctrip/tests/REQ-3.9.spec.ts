// requirement: REQ-3.9
import { test, setChecked, button, radio, textVisible, textToken, displayedOrderNumber, openHome, openBooking, submitBooking, heading } from "./helpers";

test('REQ-3.9: Pay with simulated Alipay', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await submitBooking(page);
  await heading(page, 'Payment');
  const number = await displayedOrderNumber(page);
  await setChecked(radio(page, 'Alipay'));
  await button(page, 'Pay now').click();
  await textVisible(page, /^(?:[✓✔]\s*)?Payment successful[.!]?$/i);
  await textVisible(page, textToken('JD5162'));
  if (number) await textVisible(page, textToken(number));
});
