// requirement: REQ-3.7
import { test, expect } from '@playwright/test';
import { home, action, region, openProduct, DETAIL } from './helpers';

test('REQ-3.7: Switch product thumbnail image', async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const images = region(page, 'Product images');
  const main = images.getByRole('img', { name: DETAIL, exact: true });
  await expect(main).toHaveCount(1); await expect(main).toBeVisible();
  // Compare only public resource identities; do not download or inspect image contents.
  await expect(main).toHaveAttribute('src', /\S+/);
  const front = await main.getAttribute('src');
  await action(images, 'Back').click();
  await expect(main).toHaveCount(1); await expect(main).toBeVisible();
  await expect.poll(() => main.getAttribute('src')).not.toBe(front);
  await action(images, 'Front').click();
  await expect(main).toHaveAttribute('src', front!);
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
});
