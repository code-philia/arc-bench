// requirement: REQ-7.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, checkHeaders, entry, expectMaskedPassenger, manager } from './helpers';
test("REQ-7.1: Inspect passenger table and protected holder", async ({ page }) => {
    await entry(page);
    const holder = await manager(page);
    await checkHeaders(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
    const record = await expectMaskedPassenger(page, holder);
    await expect(button(record, 'Delete')).toHaveCount(0);
});
