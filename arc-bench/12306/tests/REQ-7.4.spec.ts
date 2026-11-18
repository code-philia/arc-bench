// requirement: REQ-7.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, dialog, entry, expectMaskedPassenger, manager, passengerRow, text } from './helpers';
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
    await expect(passengerRow(page, first.name)).toHaveCount(0);
    await expect(passengerRow(page, second.name)).toHaveCount(0);
    await expectMaskedPassenger(page, holder);
    await page.reload();
    await expect(passengerRow(page, first.name)).toHaveCount(0);
    await expect(passengerRow(page, second.name)).toHaveCount(0);
    await expectMaskedPassenger(page, holder);
});
