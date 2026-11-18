// requirement: REQ-1.1
import { test, expect, action, openHome, sidebar as workspaceSidebar, sidebarControl, expectSidebarExpanded, searchField, expectCurrent } from './helpers';

test('REQ-1.1: Open the workspace', async ({ page }) => {
  await openHome(page);
  const sidebar = workspaceSidebar(page);
  await expect(sidebar).toBeVisible();
  await expectSidebarExpanded(page, true);
  for (const name of ['Notes', 'Reminders', 'Archived', 'Trash', 'Edit Labels']) {
    await expect(action(sidebar, name)).toBeVisible();
  }
  await expectCurrent(page, 'Notes');
  await expect(searchField(page)).toBeVisible();
  await expect(action(page, 'Settings menu')).toBeVisible();
  await expect(action(page, 'List view')).toBeVisible();
});

test('REQ-1.1: Collapse and expand the sidebar', async ({ page }) => {
  await openHome(page);
  const sidebar = workspaceSidebar(page);
  const toggle = sidebarControl(page);
  await expectSidebarExpanded(page, true);
  await toggle.click();
  await expectSidebarExpanded(page, false);
  for (const name of ['Notes', 'Reminders', 'Archived', 'Trash']) {
    await expect(action(sidebar, name)).toBeVisible();
    await expect(sidebar.getByText(name, { exact: true }).filter({ visible: true })).toHaveCount(0);
  }
  await toggle.click();
  await expectSidebarExpanded(page, true);
  for (const name of ['Notes', 'Reminders', 'Archived', 'Trash']) {
    await expect(sidebar.getByText(name, { exact: true }).filter({ visible: true })).toBeVisible();
  }
});
