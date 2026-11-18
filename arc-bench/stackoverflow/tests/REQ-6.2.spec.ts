import {test, login,checkPythonWatchPreference} from './helpers';

// requirement: REQ-6.2

test('REQ-6.2: Toggle python watch preference', async ({ page, browser }, info) => {
  await login(page,'tag_watcher');
  await checkPythonWatchPreference(page);
});
