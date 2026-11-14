// requirement: REQ-9.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guidePanel, link, region, selectedGuidePanel, selectedTab } from './helpers';
test("REQ-9.3.1: Open quick question How to book tickets online?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to book tickets online?").click();
    await expect(selectedTab(page, "Ticketing")).toBeVisible();
    await expect(guidePanel(page, "Ticketing").getByRole('heading', { name: "How to book tickets online?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to change or refund tickets?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to change or refund tickets?").click();
    await expect(selectedTab(page)).toHaveCount(1);
    await expect((await selectedGuidePanel(page)).getByRole('heading', { name: "How to change or refund tickets?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to check train status?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to check train status?").click();
    await expect(selectedTab(page)).toHaveCount(1);
    await expect((await selectedGuidePanel(page)).getByRole('heading', { name: "How to check train status?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to use 12306 mobile app?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to use 12306 mobile app?").click();
    await expect(selectedTab(page)).toHaveCount(1);
    await expect((await selectedGuidePanel(page)).getByRole('heading', { name: "How to use 12306 mobile app?", exact: true })).toBeInViewport();
});
