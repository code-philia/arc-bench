import { profileReputation, test, expect, login, openQuestion, ownProfile, action, region, answer, output, asUser, createQuestion, createAnswer, numeric, expectNumeric, confirmDeletion , actorName } from './helpers';
import { deletionAnswerBody } from './fixtures/data';

// requirement: REQ-4.6

test('REQ-4.6: Delete answer and reverse vote reputation', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Delete Question');
  const text=deletionAnswerBody;
  await createAnswer(browser,title,'answer_delete_user',text);
  let reputation=0;
  await asUser(browser,'answer_voter',async voter => {
    await openQuestion(voter,title);
    reputation=await numeric(region(answer(voter,actorName('answer_delete_user')),'Author'),'Reputation');
    await action(answer(voter,actorName('answer_delete_user')),'Up vote').click();
    await expectNumeric(region(answer(voter,actorName('answer_delete_user')),'Author'),'Reputation',reputation+10);
  });
  await login(page,'answer_delete_user'); await openQuestion(page,title);
  await action(answer(page,actorName('answer_delete_user')),'Delete answer').click(); await confirmDeletion(page);
  await expect(region(page,'Answers').getByText(text,{exact:true})).toHaveCount(0);
  await expectNumeric(page,'Answer count',0);
  await ownProfile(page); expect(await profileReputation(page,actorName('answer_delete_user'))).toBe(reputation);
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,title);
   await expect(region(visitor,'Answers').getByText(text,{exact:true})).toHaveCount(0);
   await expectNumeric(visitor,'Answer count',0);
  });
});
