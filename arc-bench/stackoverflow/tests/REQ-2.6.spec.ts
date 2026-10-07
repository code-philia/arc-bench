import { test, expect, entry, action, field, region, suffix, freezeClock } from './helpers';
import { password } from './fixtures/data';

// requirement: REQ-2.6

test('REQ-2.6: Log in with UI-created credentials', async ({ page, browser }, info) => {
  const email=`new_stack_user+${suffix(info)}@example.com`;
  await entry(page); await action(page.getByRole('banner'),'Sign up').click();
  await field(region(page,'Sign up'),'Email').fill(email);
  await field(region(page,'Sign up'),'Password').fill(password);
  await action(region(page,'Sign up'),'Sign up').click();
  await expect(action(page.getByRole('banner'),email)).toBeVisible();
  const context=await browser.newContext({baseURL:process.env.SO_BASE_URL,timezoneId:'UTC'});
  try {
   const fresh=await context.newPage(); await freezeClock(fresh,'2026-07-21T12:02:00Z');
   await entry(fresh); await expect(action(fresh.getByRole('banner'),email)).toHaveCount(0);
   await action(fresh.getByRole('banner'),'Log in').click();
   const form=region(fresh,'Log in');
   await field(form,'Email').fill(email); await field(form,'Password').fill(password);
   await action(form,'Log in').click();
   await expect(action(fresh.getByRole('banner'),email)).toBeVisible();
   await expect(region(fresh,'Question feed')).toBeVisible();
  } finally {await context.close();}
});
