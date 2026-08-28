import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.3
// fixtures: accounts.filterUser, homepage_questions, tags.catalog

test('REQ-7.3: Create Custom Filter', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.filterUser);
  await h.openQuestionList(page);
  await h.clickFirstAvailable(page, [[/^filter$/i]]);
  await h.expectTextsVisible(page, [/sort/i, /tag/i, /filter panel/i]);
  await h.setCheckbox(page, [/unanswered/i], true);
  await h.chooseOption(page, [/sort/i], [/newest/i]);
  await h.fillField(page, [/tag/i], h.FIXTURES.tags.primary);
  await h.clickFirstAvailable(page, [[/save custom filter/i]]);
  await h.expectTextsVisible(page, [/save filter/i]);
  await h.fillField(page, [/title/i], h.FIXTURES.filters.customName);
  await h.clickFirstAvailable(page, [[/save filter/i]]);
  await h.expectTextsVisible(page, [h.FIXTURES.filters.customName]);
});
