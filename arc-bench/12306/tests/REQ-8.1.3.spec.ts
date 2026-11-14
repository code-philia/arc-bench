// requirement: REQ-8.1.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, dialog, entry, field, link, recoveryEntry, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.3: Open recovery from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, trains[0].number), 'Book').click();
    await link(dialog(page, 'Login'), recoveryEntry).click();
    await expect(field(page, 'Email:')).toBeVisible();
    await expect(field(page, 'ID number:')).toBeVisible();
    await expect(button(page, 'submit')).toBeVisible();
});
