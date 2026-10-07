import { test, expect, entry, action, field, region, suffix } from './helpers';
import { accounts, password } from './fixtures/data';

// requirement: REQ-2.2

test('REQ-2.2: Register and automatically sign in', async ({ page, browser }, info) => {
  await entry(page);
  await action(page.getByRole('banner'), 'Sign up').click();
  const form = region(page,'Sign up');
  await expect(page.getByRole('heading', {name:'Join Stack Overflow', exact:true})).toBeVisible();
  await expect(form).toContainText(/terms|TOS/i);
  await expect(form).toContainText(/privacy/i);
  const email = `new_stack_user+${suffix(info)}@example.com`;
  await field(form,'Email').fill(email);
  await field(form,'Password').fill(password);
  await action(form,'Sign up').click();
  await expect(action(page.getByRole('banner'),email)).toBeVisible();
  await expect(region(page,'Question feed')).toBeVisible();
});

test('REQ-2.2: Reject duplicate email', async ({ page, browser }, info) => {
  await entry(page);
  await action(page.getByRole('banner'), 'Sign up').click();
  const form = region(page,'Sign up');
  await field(form,'Email').fill(accounts.stack_user);
  await field(form,'Password').fill(password);
  await action(form,'Sign up').click();
  await expect(form.getByText('Email is already in use', {exact:true})).toBeVisible();
  await expect(form).toBeVisible();
  await expect(action(page.getByRole('banner'),'Stack User')).toHaveCount(0);
});

test('REQ-2.2: Reject weak password', async ({ page, browser }, info) => {
  await entry(page);
  await action(page.getByRole('banner'),'Sign up').click();
  const form = region(page,'Sign up');
  const email = `weak_password_candidate+${suffix(info)}@example.com`;
  await field(form,'Email').fill(email);
  await field(form,'Password').fill('short');
  await action(form,'Sign up').click();
  await expect(form).toContainText(/(?:minimum|at least) 8 characters/i);
  await expect(form).toBeVisible();
  await expect(action(page.getByRole('banner'),email)).toHaveCount(0);
});
