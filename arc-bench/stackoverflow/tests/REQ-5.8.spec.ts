import { test, expect, login, openQuestion, action, field, region, post, comment, createQuestion, createComment, actorName, expectCommentTimestamp } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.8

test('REQ-5.8: Attach a nested reply to its parent', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Reply Question');
  await createComment(browser,title,'helpful_user');
  await login(page,'comment_reply_user'); await openQuestion(page,title);
  const parent=comment(post(page));
  await expect(parent).toContainText(actorName('helpful_user'));
  await action(parent,'Reply').click();
  await field(parent,'Reply').fill('Thanks, I will add the retry case.');
  const started=Date.now();await action(parent,'Add Reply').click();
  await expect(region(parent,'Replies')).toContainText('Thanks, I will add the retry case.');
  await expect(region(parent,'Replies')).toContainText('@'+actorName('helpful_user'));
  await expect(region(parent,'Replies')).toContainText(actorName('comment_reply_user'));
  const period={start:started,end:Date.now()};await expectCommentTimestamp(region(parent,'Replies'),period);
  const parentBox=await parent.boundingBox(),replyBox=await region(parent,'Replies').boundingBox();
  expect(parentBox).not.toBeNull();expect(replyBox).not.toBeNull();expect(replyBox!.x).toBeGreaterThan(parentBox!.x);
  await page.reload();
  const saved=region(comment(post(page)),'Replies');
  await expect(saved).toContainText('Thanks, I will add the retry case.');await expect(saved).toContainText(actorName('comment_reply_user'));await expect(saved).toContainText('@'+actorName('helpful_user'));await expectCommentTimestamp(saved,period);
});
