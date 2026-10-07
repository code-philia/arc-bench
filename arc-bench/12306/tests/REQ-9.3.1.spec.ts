// requirement: REQ-9.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region } from './helpers';
test("REQ-9.3.1: Open quick question How to book tickets online?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to book tickets online?").click();
    await expect(page.getByRole('tab', { name: "Ticketing", exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').getByRole('heading', { name: "How to book tickets online?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to change or refund tickets?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to change or refund tickets?").click();
    await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
    await expect(page.getByRole('tabpanel').getByRole('heading', { name: "How to change or refund tickets?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to check train status?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to check train status?").click();
    await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
    await expect(page.getByRole('tabpanel').getByRole('heading', { name: "How to check train status?", exact: true })).toBeInViewport();
});
test("REQ-9.3.1: Open quick question How to use 12306 mobile app?", async ({ page }) => {
    await entry(page);
    const q = region(page, 'Quick Guide');
    for (const name of ['How to book tickets online?', 'How to change or refund tickets?', 'How to check train status?', 'How to use 12306 mobile app?'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "How to use 12306 mobile app?").click();
    await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
    await expect(page.getByRole('tabpanel').getByRole('heading', { name: "How to use 12306 mobile app?", exact: true })).toBeInViewport();
});
