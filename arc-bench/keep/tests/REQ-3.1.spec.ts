// requirement: REQ-3.1
import { test, expect, action, openHome, createLabel, labelManager, labelField, sidebar as workspaceSidebar } from './helpers';
import { noteInput } from './fixtures/data';

test('REQ-3.1: Create a user label', async ({ page }) => {
  const input = noteInput();
  await openHome(page);
  const label = input.name('New user label');
  await createLabel(page, label);
  await page.reload();
  const sidebar = workspaceSidebar(page);
  await expect(action(sidebar, label)).toHaveCount(1);
  await expect(action(sidebar, label)).toBeVisible();
  const dialog = await labelManager(page);
  await labelField(dialog, label);
  await action(dialog, 'Done').click();
  await expect(dialog).toBeHidden();
});
