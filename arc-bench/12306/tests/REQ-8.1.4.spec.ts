// requirement: REQ-8.1.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, dialog, entry, field, link, registerEntry, registerSubmit, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.4: Open registration from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, trains[0].number), 'Book').click();
    await link(dialog(page, 'Login'), registerEntry).click();
    for (const label of ['Username', 'Password', 'Confirm Password'])
        await expect(field(page, label)).toBeVisible();
    await expect(registerSubmit(page)).toBeVisible();
});
