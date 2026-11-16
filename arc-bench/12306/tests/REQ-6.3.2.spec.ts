// requirement: REQ-6.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, createAccount, entry, field, region, section, selectChoice } from './helpers';
test("REQ-6.3.2: Save passenger type", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await section(page, 'Personal', 'User information');
    const r = region(page, 'Additional information');
    await button(r, 'Edit').click();
    await selectChoice(field(r, 'Passenger type'), 'Child');
    await button(r, 'Save').click();
    await expect(r).toContainText('Child');
    await expect(button(r, 'Edit')).toBeVisible();
    await page.reload();
    await expect(r).toContainText('Child');
});
