import { test, expect, login, openQuestion, action, post, comment, expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.5

test('REQ-5.5: Apply and remove a helpful-comment vote', async ({ page, browser }, info) => {
  await login(page,'comment_vote_user'); await openQuestion(page,'SO Comment Vote Question');
  const target=comment(post(page));
  await expect(action(target,'Down vote')).toHaveCount(0);
  await expectNumeric(target,'Comment votes',1);
  await action(target,'Up vote').click();
  await expectNumeric(target,'Comment votes',2);
  await expect(action(target,'Up vote')).toHaveAttribute('aria-pressed','true');
  await action(target,'Up vote').click();
  await expectNumeric(target,'Comment votes',1);
  await expect(action(target,'Up vote')).toHaveAttribute('aria-pressed','false');
});
