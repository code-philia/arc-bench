// requirement: REQ-3.1
import { test, expect, action, openHome, createLabel, labelManager } from './helpers';
import { identity } from './fixtures/data';

test('REQ-3.1: Create a user label', async ({ page }, info) => {
  await openHome(page);
  const label = identity(info, 'New user label');
  await createLabel(page, label);
  await page.reload();
  const sidebar = page.getByRole('navigation', { name: 'Sidebar', exact: true });
  await expect(action(sidebar, label)).toHaveCount(1);
  await expect(action(sidebar, label)).toBeVisible();
  const dialog = await labelManager(page);
  const field = dialog.getByRole('textbox', { name: `Label name ${label}`, exact: true });
  await expect(field).toHaveCount(1);
  await expect(field).toHaveValue(label);
  await action(dialog, 'Done').click();
});
