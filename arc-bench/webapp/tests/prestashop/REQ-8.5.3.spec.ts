import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.5.3
// fixtures: registered_user, order_history

test('REQ-8.5.3: Reorder', async ({ page }) => {
  await h.openOrderHistory(page);
  await h.clickFirstAvailable(page, [[/reorder/i]]);
  await h.expectTextsVisible(page, [/cart/i, /subtotal/i]);
});
