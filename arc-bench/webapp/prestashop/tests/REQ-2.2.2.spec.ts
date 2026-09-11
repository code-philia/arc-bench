import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.2
// fixtures: public_homepage

test('REQ-2.2.2: Manual Carousel Switch', async ({ page }) => {
  await h.openHome(page);
  await h.expectCarouselToChange(page, async () => {
    await h.clickFirstAvailable(page, [[/next/i, /previous/i, /right/i, /left/i]]);
  });
});
