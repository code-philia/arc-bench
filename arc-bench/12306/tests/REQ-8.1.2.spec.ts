// requirement: REQ-8.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { availableBookAction, bookingLoginTitle, button, dialog, entry, heading, loginFields, picture, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.2: Require quick login before booking", async ({ page }) => {
    await entry(page);
    await search(page);
    await (await availableBookAction(row(page, trains[0].number))).click();
    const d = dialog(page, bookingLoginTitle);
    await expect(picture(d, /\b12306\b|^Login$/i)).toBeVisible();
    await expect(heading(d, bookingLoginTitle)).toBeVisible();
    await expect(loginFields(d).account).toBeVisible();
    await expect(loginFields(d).password).toBeVisible();
    await expect(button(d, 'LOGIN')).toBeVisible();
    await expect(heading(page, 'Train Information:')).not.toBeVisible();
});
