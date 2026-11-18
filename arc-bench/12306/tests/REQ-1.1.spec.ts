// requirement: REQ-1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, field, home, link, moreEntry, picture, quickGuide, region } from './helpers';
test("REQ-1.1: Browse public homepage", async ({ page }) => {
    await entry(page);
    await expect(picture(page, '12306')).toBeVisible();
    for (const name of ['Login', 'Register', 'My 12306'])
        await expect(link(page, name)).toBeVisible();
    for (const name of ['Home', 'Booking', 'Travel guide'])
        await expect(link(page.getByRole('navigation'), name)).toBeVisible();
    const banners = region(page, 'Home banners');
    await expect(picture(banners, 'Banner 1')).toBeVisible();
    await button(banners, 'Next banner').click();
    await expect(picture(banners, 'Banner 2')).toBeVisible();
    await button(banners, 'Next banner').click();
    await expect(picture(banners, 'Banner 3')).toBeVisible();
    await home(page);
    const s = region(page, 'Ticket search');
    await expect(field(s, 'From')).toHaveCount(1);
    await expect(field(s, 'To')).toHaveCount(1);
    await expect(field(s, 'Date')).toHaveCount(1);
    await expect(button(s, 'Search')).toBeEnabled();
    const guide = quickGuide(page);
    await expect(guide).toBeVisible();
    for (const name of ['How to book tickets online?', moreEntry])
        await expect(link(guide, name)).toBeVisible();
});
