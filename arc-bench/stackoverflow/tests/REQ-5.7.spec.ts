import { test, expect, login, openQuestion, action, field, region, post, comment, createQuestion, createComment } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.7

test('REQ-5.7: Attach a nested reply to its parent', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Reply Question');
  await createComment(browser,title,'helpful_user');
  await login(page,'comment_reply_user'); await openQuestion(page,title);
  const parent=comment(post(page));
  await expect(parent).toContainText('Helpful User');
  await action(parent,'Reply').click();
  await field(parent,'Reply').fill('Thanks, I will add the retry case.');
  await action(parent,'Add Reply').click();
  await expect(region(parent,'Replies')).toContainText('Thanks, I will add the retry case.');
  await expect(region(parent,'Replies')).toContainText('@Helpful User');
  await page.reload();
  await expect(region(comment(post(page)),'Replies')).toContainText('Thanks, I will add the retry case.');
});
