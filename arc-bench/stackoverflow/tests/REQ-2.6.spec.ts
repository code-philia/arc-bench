import { pageBanner, test, expect, entry, action, field, region, suffix, loginForm , signupForm } from './helpers';
import { password } from './fixtures/data';

// requirement: REQ-2.6

test('REQ-2.6: Log in with UI-created credentials', async ({ page, browser, baseURL }, info) => {
  const email=`new_stack_user+${suffix(info)}@example.com`;
  await entry(page); await action(pageBanner(page),'Sign up').click();
  await field(await signupForm(page),'Email').fill(email);
  await field(await signupForm(page),'Password').fill(password);
  await action(await signupForm(page),'Create account').click();
  await expect(action(pageBanner(page),email)).toBeVisible();
  const context=await browser.newContext({baseURL,timezoneId:'UTC'});
  try {
   const fresh=await context.newPage();
   await entry(fresh); await expect(action(pageBanner(fresh),email)).toHaveCount(0);
   await action(pageBanner(fresh),'Log in').click();
   const form=await loginForm(fresh);
   await field(form,'Email').fill(email); await field(form,'Password').fill(password);
   await action(form, 'Sign in').click();
   await expect(action(pageBanner(fresh),email)).toBeVisible();
   await expect(region(fresh,'Question feed')).toBeVisible();
  } finally {await context.close();}
});
