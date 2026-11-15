import { minimumPasswordMessage, test, expect, entry, action, field, region, suffix, actorName, signupForm, prepareActor, ownProfile, activity, collection, expectAnonymous } from './helpers';
import { password } from './fixtures/data';

// requirement: REQ-2.2

test('REQ-2.2: Register and automatically sign in', async ({ page, browser }, info) => {
  await entry(page);
  await action(page.getByRole('banner'), 'Sign up').click();
  const form = await signupForm(page);
  await expect(page.getByRole('heading', {name:'Join Stack Overflow', exact:true})).toBeVisible();
  await expect(form).toContainText(/terms|TOS/i);
  await expect(form).toContainText(/privacy/i);
  const email = `new_stack_user+${suffix(info)}@example.com`;
  await field(form,'Email').fill(email);
  await field(form,'Password').fill(password);
  await action(form,'Create account').click();
  await expect(action(page.getByRole('banner'),email)).toBeVisible();
  await expect(region(page,'Question feed')).toBeVisible();
  await ownProfile(page,email);await expect(region(page,'Badges')).not.toContainText(/Teacher|Great Answer|Good Answer/);
  const questions=await activity(page,'Questions',email);await expect(collection(questions,'Question')).toHaveCount(0);
});

test('REQ-2.2: Reject duplicate email', async ({ page, browser }, info) => {
  const identity=await prepareActor(page,'stack_user');
  await entry(page);
  await action(page.getByRole('banner'), 'Sign up').click();
  const form = await signupForm(page);
  await field(form,'Email').fill(identity.email);
  await field(form,'Password').fill(password);
  await action(form,'Create account').click();
  await expect(form.getByText('Email is already in use', {exact:true})).toBeVisible();
  await expect(form).toBeVisible();
  await expect(action(page.getByRole('banner'),actorName('stack_user'))).toHaveCount(0);await expectAnonymous(page);
});

test('REQ-2.2: Reject weak password', async ({ page, browser }, info) => {
  await entry(page);
  await action(page.getByRole('banner'),'Sign up').click();
  const form = await signupForm(page);
  const email = `weak_password_candidate+${suffix(info)}@example.com`;
  await field(form,'Email').fill(email);
  await field(form,'Password').fill('short');
  await action(form,'Create account').click();
  await expect(form).toContainText(minimumPasswordMessage);
  await expect(form).toBeVisible();
  await expect(action(page.getByRole('banner'),email)).toHaveCount(0);await expectAnonymous(page);
});
