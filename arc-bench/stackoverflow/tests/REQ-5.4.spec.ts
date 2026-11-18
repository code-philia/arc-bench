import {test, expect, login, openQuestion, action, field, post, comment, noUsableAction, createQuestion, createComment, expectField, expectBody, waitForCommentExpiry } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.4

test('REQ-5.4: Save comment within five minutes', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Edit Question');
  // Real elapsed time supports either a browser or a server-owned deadline.
  test.setTimeout(test.info().timeout+310_000);
  const period=await createComment(browser,title,'comment_edit_user');
  await login(page,'comment_edit_user'); await openQuestion(page,title);
  const original=comment(post(page));
  await action(original,'Edit comment').click();
  await expectField(field(original,'Comment'),commentBody);
  await field(original,'Comment').fill('Can you share a minimal retry example?');
  await field(original,'Comment').press('Enter');
  await expect(comment(post(page),'Can you share a minimal retry example?')).toContainText(/edited/i);
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  await expect(comment(post(page))).toHaveCount(0);
  await page.reload();
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  await expect(comment(post(page),'Can you share a minimal retry example?')).toContainText(/edited/i);
  await expect(comment(post(page))).toHaveCount(0);
  await expect(action(comment(post(page),'Can you share a minimal retry example?'),'Edit comment')).toBeEnabled();
  // Use the latest possible publication time, then observe after expiry.
  await waitForCommentExpiry(period);
  {
    await page.reload();
    await noUsableAction(comment(post(page),'Can you share a minimal retry example?'),'Edit comment');
    await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
  }
  await page.reload();
  await noUsableAction(comment(post(page),'Can you share a minimal retry example?'),'Edit comment');
  await expectBody(comment(post(page),'Can you share a minimal retry example?'),'Can you share a minimal retry example?');
});
