import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.1
// fixtures: public_homepage

test('REQ-2.2.1: Carousel Auto Switch', async ({ page }) => {
  await h.openHome(page);
  await h.expectTextsVisible(page, [/carousel/i, /slide/i]);
});
