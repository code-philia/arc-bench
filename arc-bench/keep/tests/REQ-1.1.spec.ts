// requirement: REQ-1.1
import { test, expect, action, openHome } from './helpers';

test('REQ-1.1: Open the workspace', async ({ page }) => {
  await openHome(page);
  const sidebar = page.getByRole('navigation', { name: 'Sidebar', exact: true });
  await expect(sidebar).toBeVisible();
  await expect(action(page, 'Toggle sidebar')).toHaveAttribute('aria-expanded', 'true');
  for (const name of ['Notes', 'Reminders', 'Archived', 'Trash', 'Edit Labels']) {
    await expect(action(sidebar, name)).toBeVisible();
  }
  await expect(action(sidebar, 'Notes')).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('searchbox', { name: 'Search', exact: true })).toBeVisible();
  await expect(action(page, 'Settings menu')).toBeVisible();
  await expect(action(page, 'List view')).toBeVisible();
});

test('REQ-1.1: Collapse and expand the sidebar', async ({ page }) => {
  await openHome(page);
  const sidebar = page.getByRole('navigation', { name: 'Sidebar', exact: true });
  const toggle = action(page, 'Toggle sidebar');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(sidebar.getByText('Notes', { exact: true })).toBeHidden();
  for (const name of ['Notes', 'Reminders', 'Archived', 'Trash']) {
    await expect(action(sidebar, name)).toBeVisible();
  }
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(sidebar.getByText('Notes', { exact: true })).toBeVisible();
});
