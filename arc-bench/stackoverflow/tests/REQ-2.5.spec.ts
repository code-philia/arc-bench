import { test, expect, entry, login, action, field, region } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-2.5

test('REQ-2.5: Move between login and registration', async ({ page, browser }, info) => {
  await entry(page); await action(page.getByRole('banner'),'Log in').click();
  await action(region(page,'Log in'),'Sign up').click();
  await expect(region(page,'Sign up')).toBeVisible();
  for (const name of ['Email','Password']) await expect(field(region(page,'Sign up'),name)).toBeVisible();
  await expect(action(region(page,'Sign up'),'Sign up')).toBeVisible();
  await expect(region(page,'Log in')).toHaveCount(0);
  await action(region(page,'Sign up'),'Log in').click();
  await expect(region(page,'Log in')).toBeVisible();
  for (const name of ['Email','Password']) await expect(field(region(page,'Log in'),name)).toBeVisible();
  await expect(region(page,'Sign up')).toHaveCount(0);
  await expect(action(page.getByRole('banner'),'Stack User')).toHaveCount(0);
});
