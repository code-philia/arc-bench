import {test, expect, login, openQuestion, action, post, comment, expectNumeric, createQuestion, createComment, numeric, expectActive } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.6

test('REQ-5.6: Apply and remove a helpful-comment vote', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Vote Question');
  await createComment(browser,title,'helpful_user');
  await login(page,'comment_vote_user'); await openQuestion(page,title);
  const target=comment(post(page));
  await expect(action(target,'Down vote')).toHaveCount(0);
  await expectNumeric(target,'Comment votes',0);
  await action(target,'Up vote').click();
  await expectNumeric(target,'Comment votes',1);
  await expectActive(action(target,'Up vote'),true);
  await page.reload();await expectNumeric(comment(post(page)),'Comment votes',1);await expectActive(action(comment(post(page)),'Up vote'),true);
  await action(target,'Up vote').click();
  await expectNumeric(target,'Comment votes',0);
  await expectActive(action(target,'Up vote'),false);
  await page.reload();await expectNumeric(comment(post(page)),'Comment votes',0);await expectActive(action(comment(post(page)),'Up vote'),false);
});
