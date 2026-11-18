// requirement: REQ-8.1.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { availableBookAction, bookingLoginTitle, dialog, entry, field, openRegistrationFromLogin, registerSubmit, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-8.1.4: Open registration from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await (await availableBookAction(row(page, trains[0].number))).click();
    await openRegistrationFromLogin(dialog(page, bookingLoginTitle));
    for (const label of ['Username', 'Password', 'Confirm Password'])
        await expect(field(page, label)).toBeVisible();
    await expect(registerSubmit(page)).toBeVisible();
});
