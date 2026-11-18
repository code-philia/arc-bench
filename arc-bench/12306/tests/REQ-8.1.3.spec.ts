// requirement: REQ-8.1.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { availableBookAction, bookingLoginTitle, button, dialog, entry, field, link, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.3: Open recovery from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await (await availableBookAction(row(page, trains[0].number))).click();
    await link(dialog(page, bookingLoginTitle), 'Forgot your password').click();
    await expect(field(page, 'Email:')).toBeVisible();
    await expect(field(page, 'ID number:')).toBeVisible();
    await expect(button(page, 'submit')).toBeVisible();
});
