// requirement: REQ-7.5.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, entry, link, manager, passengerKeyword, row } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.5.2: Clear passenger search", async ({ page }) => {
    await entry(page);
    await manager(page);
    const target = newPassenger();
    await addPassenger(page, target);
    const other = newPassenger();
    await addPassenger(page, other);
    await passengerKeyword(page).fill(target.name);
    await button(page, 'Search').click();
    await expect(row(page, other.passport)).not.toBeVisible();
    await link(page, /^(×|Clear(?: (?:passenger )?search)?)$/i).click();
    await expect(passengerKeyword(page)).toHaveValue('');
    await expect(row(page, target.passport)).toBeVisible();
    await expect(row(page, other.passport)).toBeVisible();
});
