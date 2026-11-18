// requirement: REQ-9.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guideCategories, guideCategory, guideDropdown, guidePanel, home, link, moreEntry, navigationEntries, selectedTab } from './helpers';
test("REQ-9.2.2: Open all dropdown guide categories", async ({ page }) => {
    await entry(page);
    for (const category of guideCategories) {
        const dropdown = await guideDropdown(page);
        for (const name of guideCategories) {
            const group = guideCategory(page, dropdown, name);
            const questions = navigationEntries(group, new RegExp('^(?!(?:' + name + '|More(?:\\s*[>›»→])*)$).+'));
            await expect(questions).toHaveCount(4);
            const labels = await questions.evaluateAll(entries =>
                entries.map(entry => (entry.getAttribute('aria-label') || entry.textContent || '').trim()));
            expect(new Set(labels)).toHaveProperty('size', 4);
            await expect(link(group, moreEntry)).toHaveCount(1);
        }
        await link(guideCategory(page, dropdown, category), moreEntry).click();
        await expect(selectedTab(page, category)).toBeVisible();
        await expect(guidePanel(page, category)).toContainText(/\S+/);
        await home(page);
    }
});
