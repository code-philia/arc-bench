import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.3.6
// fixtures: orders_upcoming_user

test('REQ-5.3.6: Show a paid upcoming order in the upcoming trips tab', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersUpcomingUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.expectTextsVisible(page, ['Upcoming trips']);
});
