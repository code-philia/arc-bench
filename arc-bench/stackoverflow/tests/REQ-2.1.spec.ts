import {test, expect, login, openLogin, action, field, expectField, actorName, actor, prepareActor, expectAnonymous } from './helpers';
import { password } from './fixtures/data';

// requirement: REQ-2.1

test('REQ-2.1: Sign in and retain session', async ({ page, browser }, info) => {
  await login(page, 'stack_user');
  await page.reload();
  await expect(action(page.getByRole('banner'), actorName('stack_user'))).toBeVisible();
  await expect(action(page.getByRole('banner'), 'Log in')).toHaveCount(0);
});

test('REQ-2.1: Reject empty credentials', async ({ page, browser }, info) => {
  const form = await openLogin(page);
  await action(form, 'Sign in').click();
  await expect(form.getByText('Email cannot be empty', { exact: true })).toBeVisible();
  await expect(form.getByText('Password cannot be empty', { exact: true })).toBeVisible();
  await expect(form).toBeVisible();await expectAnonymous(page);
});

test('REQ-2.1: Reject malformed email', async ({ page, browser }, info) => {
  const form = await openLogin(page);
  await field(form, 'Email').fill('invalid-email-format');
  await field(form, 'Password').fill('Password123!');
  await action(form, 'Sign in').click();
  await expect(form.getByText('The email is not a valid email address', { exact: true })).toBeVisible();
  await expect(form).toBeVisible();
  await expectAnonymous(page);
});

test('REQ-2.1: Reject unknown account', async ({ page, browser }, info) => {
  const form = await openLogin(page);
  await field(form, 'Email').fill(actor('question_creator').email);
  await field(form, 'Password').fill('Password123!');
  await action(form, 'Sign in').click();
  await expect(form.getByText('No account found with this email', { exact: true })).toBeVisible();
  await expect(form).toBeVisible();
  await expectAnonymous(page);
});

test('REQ-2.1: Reject wrong password', async ({ page, browser }, info) => {
  const identity=await prepareActor(page,'stack_user');
  const form = await openLogin(page);
  await field(form, 'Email').fill(identity.email);
  await field(form, 'Password').fill('WrongPassword123!');
  await action(form, 'Sign in').click();
  await expect(form.getByText('The email or password does not match any account', { exact: true })).toBeVisible();
  await expect(form).toBeVisible();
  await expect(action(page.getByRole('banner'),identity.displayName)).toHaveCount(0);
  await expectAnonymous(page);
});

test('REQ-2.1: Toggle password visibility', async ({ page, browser }, info) => {
  const form = await openLogin(page);
  await expect(action(form, 'Forgot password?')).toBeVisible();
  await expect(action(form,'Sign up')).toBeVisible();
  await field(form, 'Password').fill(password);
  await action(form, 'Show password').click();
  await expect(field(form, 'Password')).toHaveAttribute('type','text');
  await expectField(field(form, 'Password'),password);
  for(const name of ['Forgot password?','Sign up'])await expect(action(form,name)).toBeVisible();
  await action(form, 'Hide password').click();
  await expect(field(form, 'Password')).toHaveAttribute('type','password');
  await expectField(field(form, 'Password'),password);
  for(const name of ['Forgot password?','Sign up'])await expect(action(form,name)).toBeVisible();
});
