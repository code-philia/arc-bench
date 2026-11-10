import { generateBookData, generateChapterData } from './fixtures/data';
// requirement: REQ-6.3
import { test } from '@playwright/test';
import { enter, heading, text, createBook, action, collection, textField } from './helpers';

test("REQ-6.3: Save and open a chapter", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 6.2.1' });
  const book = await createBook(page, bookData);
  await action(page, 'New Chapter').activate();
  const chapterData = generateChapterData({ prefix: 'Chapter Created 6.2.1', bookName: book });
  const chapter = chapterData.name;
  await textField(page, 'Name').fill(chapter);
  await textField(page, 'Description').fill(chapterData.description);
  await action(page, 'Save Chapter').activate();
  await collection(page, 'Chapter list', { owner: book }).item(chapter).expectCount(1);
  await collection(page, 'Chapter list', { owner: book }).item(chapter).open();
  await heading(page, chapter);
  await text(page, chapterData.description, chapter);
});
