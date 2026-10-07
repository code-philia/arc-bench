// requirement: REQ-1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, search } from './helpers';
test("REQ-1.1: Browse public homepage", async ({ page }) => {
    await entry(page);
    await expect(page.getByRole('img', { name: '12306 logo', exact: true })).toBeVisible();
    for (const name of ['Login', 'Register', 'My 12306'])
        await expect(link(page, name)).toBeVisible();
    for (const name of ['Home', 'Booking', 'Travel guide'])
        await expect(link(page.getByRole('navigation'), name)).toBeVisible();
    const banners = region(page, 'Home banners');
    await expect(banners.getByRole('img', { name: 'Banner 1', exact: true })).toBeVisible();
    await button(banners, 'Next banner').click();
    await expect(banners.getByRole('img', { name: 'Banner 2', exact: true })).toBeVisible();
    await button(banners, 'Next banner').click();
    await expect(banners.getByRole('img', { name: 'Banner 3', exact: true })).toBeVisible();
    const s = region(page, 'Ticket search');
    await expect(s.getByPlaceholder('From', { exact: true })).toHaveCount(1);
    await expect(s.getByPlaceholder('To', { exact: true })).toHaveCount(1);
    await expect(field(s, 'Date')).toHaveCount(1);
    await expect(button(s, 'Search')).toBeEnabled();
    await expect(region(page, 'Quick Guide')).toBeVisible();
    for (const name of ['How to book tickets online?', 'More'])
        await expect(link(region(page, 'Quick Guide'), name)).toBeVisible();
});
