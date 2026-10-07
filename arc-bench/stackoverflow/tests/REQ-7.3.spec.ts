import { test, expect, entry, action, region, answer, output } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.3

test('REQ-7.3: Read categorized badges', async ({ page, browser }, info) => {
  await entry(page); await action(page,'Badges').click();
  const catalog=region(page,'Badge catalog');
  for (const category of ['Gold','Silver','Bronze']) await expect(region(catalog,category)).toBeVisible();
  for (const [category,name,description,count] of [['Gold','Great Answer','Recognizes a great answer',2],['Silver','Good Answer','Recognizes a good answer',3],['Bronze','Teacher','Recognizes a helpful first answer',5]] as const) {
   const group=region(catalog,category);
   await expect(group).toContainText(name); await expect(group).toContainText(description);
   await expect(output(group,`Earn count ${name}`)).toHaveText(String(count));
  }
});
