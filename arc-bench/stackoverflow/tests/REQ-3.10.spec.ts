import {test, expect, login, openQuestion, post, createQuestion, noUsableAction, expectBody } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.10

test('REQ-3.10: Prevent non-owner question deletion', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_deleter','SO Ownership Protected Question');
  await login(page,'stack_user'); await openQuestion(page,title);
  await noUsableAction(post(page),'Delete question'); await expectBody(post(page),body);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expect(page.getByRole('dialog',{name:'Confirm deletion',exact:true})).toHaveCount(0);
});
