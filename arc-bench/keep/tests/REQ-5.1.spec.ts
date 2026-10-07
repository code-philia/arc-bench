// requirement: REQ-5.1
import { test, expect, action, openHome, settingsDialog } from './helpers';

test('REQ-5.1: Save settings and discard canceled changes', async ({ page }) => {
  await openHome(page);
  let dialog = await settingsDialog(page);
  await expect(dialog.getByRole('checkbox', { name: 'Move checked items to bottom', exact: true })).toBeVisible();
  await expect(action(dialog, 'Save')).toBeVisible();
  await expect(action(dialog, 'Cancel')).toBeVisible();
  const option = () => dialog.getByRole('checkbox', { name: 'Add new items to the bottom', exact: true });
  const saved = !(await option().isChecked());
  await option().setChecked(saved);
  await action(dialog, 'Save').click();
  await expect(dialog).toBeHidden();
  await page.reload();
  dialog = await settingsDialog(page);
  await expect(option()).toBeChecked({ checked: saved });
  await option().setChecked(!saved);
  await action(dialog, 'Cancel').click();
  await expect(dialog).toBeHidden();
  dialog = await settingsDialog(page);
  await expect(option()).toBeChecked({ checked: saved });
  await action(dialog, 'Cancel').click();
});
