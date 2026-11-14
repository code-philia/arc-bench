// requirement: REQ-8.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, dialog, entry, heading, loginFields, picture, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.2: Require quick login before booking", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, trains[0].number), 'Book').click();
    const d = dialog(page, 'Login');
    await expect(picture(d, 'Login')).toBeVisible();
    await expect(heading(d, 'Login')).toBeVisible();
    await expect(loginFields(d).account).toBeVisible();
    await expect(loginFields(d).password).toBeVisible();
    await expect(button(d, 'LOGIN')).toBeVisible();
    await expect(heading(page, 'Train Information:')).not.toBeVisible();
});
