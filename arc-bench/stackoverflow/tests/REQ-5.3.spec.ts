import { test, expect, login, openQuestion, action, field, post, comment, noUsableAction } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.3

test('REQ-5.3: Save comment within five minutes', async ({ page, browser }, info) => {
  await login(page,'comment_edit_user'); await openQuestion(page,'SO Comment Edit Question');
  const original=comment(post(page));
  await action(original,'Edit').click();
  await expect(field(original,'Comment')).toHaveValue(commentBody);
  await field(original,'Comment').fill('Can you share a minimal retry example?');
  await field(original,'Comment').press('Enter');
  await expect(comment(post(page),'Can you share a minimal retry example?')).toContainText(/edited/i);
  await expect(comment(post(page))).toHaveCount(0);
});

test('REQ-5.3: Refuse an expired comment edit', async ({ page, browser }, info) => {
  await login(page,'comment_edit_user'); await openQuestion(page,'SO Comment Edit Question');
  await expect(comment(post(page))).toBeVisible();
  await noUsableAction(comment(post(page)),'Edit');
  await expect(comment(post(page))).toContainText(commentBody);
});
