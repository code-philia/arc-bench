// requirement: REQ-7.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, checkHeaders, entry, manager, row } from './helpers';
test("REQ-7.1: Inspect passenger table and protected holder", async ({ page }) => {
    await entry(page);
    const holder = await manager(page);
    await checkHeaders(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
    await expect(row(page, holder.passport)).toContainText(holder.name);
    await expect(button(row(page, holder.passport), 'Delete')).toHaveCount(0);
});
