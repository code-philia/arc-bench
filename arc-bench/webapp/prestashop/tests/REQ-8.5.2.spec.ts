import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.2
// fixtures: registered_user, order_history

test('REQ-8.5.2: View Order Details', async ({ page }) => {
  await h.openOrderHistory(page);
  await h.clickFirstAvailable(page, [[/details/i]]);
  await h.expectTextsVisible(page, [/shipping/i, /payment/i, /product/i]);
});
