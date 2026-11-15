import { test, expect, entry, action, region, answer, expectNumeric, expectCatalogBadge } from './helpers';
import {initialEnvironment} from './fixtures/data';

// requirement: REQ-7.3

test('REQ-7.3: Read categorized badges', async ({ page, browser }, info) => {
  await entry(page); await action(page,'Badges').click();
  const catalog=region(page,'Badge catalog');
  for (const category of ['Gold','Silver','Bronze']) await expect(region(catalog,category)).toBeVisible();
  for (const [category,name,description,count] of initialEnvironment.badgeCatalog) {
   const group=region(catalog,category);
   await expectCatalogBadge(group,name,description,count);
  }
});
