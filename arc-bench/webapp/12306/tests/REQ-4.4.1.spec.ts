import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: passenger_manager_user

test('REQ-4.4.1: Open and view the my passengers page', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.expectTextsVisible(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
});
