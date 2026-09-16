import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: public_homepage, notes_overview

test('REQ-6.2: Collapsible Sidebar', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.expectVisible(page, /^Notes$/i);
  await h.expectVisible(page, /^Trash$/i);
  await h.toggleSidebar(page);
  await expect(page.getByRole('button', { name: /^Toggle sidebar$/i })).toHaveAttribute('aria-expanded', 'false');
  await h.toggleSidebar(page);
  await expect(page.getByRole('button', { name: /^Toggle sidebar$/i })).toHaveAttribute('aria-expanded', 'true');
  await h.expectVisible(page, /^Notes$/i);
  await h.expectVisible(page, /^Trash$/i);
});
