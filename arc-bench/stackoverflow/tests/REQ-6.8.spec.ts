import { test, login, asUser, checkPythonWatchIsolation } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-6.8

test('REQ-6.8: Isolate tag watch preferences', async ({ page, browser }, info) => {
  await login(page,'tag_watcher');
  await asUser(browser,'stack_user',other=>checkPythonWatchIsolation(page,other));
});
