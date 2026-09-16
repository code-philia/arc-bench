import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1
// fixtures: authenticated_dashboard

test('REQ-3.1: Enter Authenticated Homepage', async ({ page }) => {
  await h.login(page);
  await h.expectTextsVisible(page, ['My Recent Drafts', 'My Recently Viewed', 'My Most Viewed Favorites', 'Recently Updated Pages']);
});
