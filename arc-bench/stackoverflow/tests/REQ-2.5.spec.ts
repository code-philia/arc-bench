import { pageBanner, test, expect, entry, login, action, field, region, loginForm, loginForms, signupForm, signupForms, expectAnonymous } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-2.5

test('REQ-2.5: Move between login and registration', async ({ page, browser }, info) => {
  await entry(page); await action(pageBanner(page),'Log in').click();
  await action(await loginForm(page),'Sign up').click();
  const signup=await signupForm(page);
  await expect(signup).toBeVisible();
  for (const name of ['Email','Password']) await expect(field(signup,name)).toBeVisible();
  await expect(action(signup,'Create account')).toBeVisible();
  await expect(await loginForms(page)).toHaveCount(0);
  await action(signup,'Log in').click();
  const form=await loginForm(page);
  await expect(form).toBeVisible();
  for (const name of ['Email','Password']) await expect(field(form,name)).toBeVisible();
  await expect(await signupForms(page)).toHaveCount(0);
  await expectAnonymous(page);
});
