import { test, expect, entry, openQuestion, action, region, post, comment, beforeText } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.2

test('REQ-5.2: Reveal the complete comment thread', async ({ page, browser }, info) => {
  await entry(page); await openQuestion(page,'SO Expanded Comment Question');
  for (let i=1;i<=5;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).toBeVisible();
  for (let i=6;i<=7;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).not.toBeVisible();
  await action(region(post(page),'Comments'),'Show 2 more comments').click();
  for (let i=1;i<=7;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).toBeVisible();
  for (let i=1;i<7;i++) await beforeText(region(post(page),'Comments'),`Retry discussion comment ${i}`,`Retry discussion comment ${i+1}`);
});
