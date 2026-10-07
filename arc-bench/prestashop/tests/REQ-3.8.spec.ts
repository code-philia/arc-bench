// requirement: REQ-3.8
import { test, expect } from '@playwright/test';
import { home, action, region, openProduct, DETAIL } from './helpers';

test('REQ-3.8: Open and close enlarged product image', async ({ page }) => {
  await home(page); await openProduct(page, DETAIL);
  const images = region(page, 'Product images');
  const main = images.getByRole('img', { name: DETAIL, exact: true });
  await expect(main).toHaveAttribute('src', /\S+/);
  const front = await main.getAttribute('src');
  await action(images, 'Back').click();
  await expect.poll(() => main.getAttribute('src')).not.toBe(front);
  const selected = await main.getAttribute('src');
  await action(images, 'Zoom').click();
  const zoom = page.getByRole('dialog', { name: 'Product image', exact: true });
  await expect(zoom).toBeVisible();
  const enlarged = zoom.getByRole('img', { name: DETAIL, exact: true });
  await expect(enlarged).toHaveCount(1); await expect(enlarged).toBeVisible();
  await action(zoom, 'Close').click(); await expect(zoom).toHaveCount(0);
  await expect(main).toHaveCount(1); await expect(main).toBeVisible();
  await expect(main).toHaveAttribute('src', selected!);
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
});
