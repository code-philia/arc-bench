// requirement: REQ-6.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, region, login, section } from './helpers';
test("REQ-6.3.2: Save passenger type", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_additional_user');
    await section(page, 'Personal', 'User information');
    const r = region(page, 'Additional information');
    await button(r, 'Edit').click();
    await field(r, 'Passenger type').selectOption({ label: 'Child' });
    await button(r, 'Save').click();
    await expect(r).toContainText('Child');
    await expect(button(r, 'Edit')).toBeVisible();
    await page.reload();
    await expect(r).toContainText('Child');
});
