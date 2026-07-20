import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.5.1
// fixtures: personal_center_user

test('REQ-4.5.1: Open a personal center page from the my 12306 dropdown', async ({ page }) => {
  await h.openHome(page);
  await h.loginAs(page, h.FIXTURES.personalCenterUser);
  await h.hoverNamed(page, /my 12306/i);
  await h.expectTextsVisible(page, ['Order center', 'User information', 'Account security', 'My passengers']);
  await h.clickNamed(page, 'Order center');
});
