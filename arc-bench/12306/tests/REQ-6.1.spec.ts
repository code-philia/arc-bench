// requirement: REQ-6.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, entry, region, section } from './helpers';
test("REQ-6.1: Inspect personal information", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await section(page, 'Personal', 'User information');
    for (const value of ['Account number', 'Name', 'Gender', 'Nationality', 'ID type', 'ID number', 'Foreign passport'])
        await expect(region(page, 'Essential information')).toContainText(value);
    await expect(region(page, 'Contact information')).toContainText('Email');
    await expect(region(page, 'Additional information')).toContainText('Passenger type');
    await expect(region(page, 'Additional information')).toContainText('Adult');
});
