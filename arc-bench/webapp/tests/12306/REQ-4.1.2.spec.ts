import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.2
// fixtures: registered_user, personal_center_user

test('REQ-4.1.2: Open the personal center home page after login', async ({ page }) => {
  await h.openPersonalCenter(page);
  await h.expectTextsVisible(page, ['Personal Center', 'Order center', 'Personal', 'Information management']);
});
