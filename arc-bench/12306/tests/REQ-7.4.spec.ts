// requirement: REQ-7.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, dialog, entry, manager, row, text } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.4: Select all protects holder", async ({ page }) => {
    await entry(page);
    const holder = await manager(page);
    const first = newPassenger();
    await addPassenger(page, first);
    const second = newPassenger();
    await addPassenger(page, second);
    await page.getByRole('checkbox', { name: 'All', exact: true }).check();
    await button(page, 'Batch deletion').click();
    const d = dialog(page, 'Are you sure you want to delete the selected passengers?');
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Passengers deleted successfully.');
    await expect(row(page, first.passport)).toHaveCount(0);
    await expect(row(page, second.passport)).toHaveCount(0);
    await expect(row(page, holder.passport)).toBeVisible();
    await page.reload();
    await expect(row(page, first.passport)).toHaveCount(0);
    await expect(row(page, second.passport)).toHaveCount(0);
    await expect(row(page, holder.passport)).toBeVisible();
});
