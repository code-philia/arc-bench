// requirement: REQ-3.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button } from './helpers';
test("REQ-3.1.1: Choose Shanghai using pinyin and Chinese", async ({ page }) => {
    await entry(page);
    for (const query of ['shang', '上海']) {
        await page.getByPlaceholder('From', { exact: true }).fill(query);
        await expect(page.getByRole('heading', { name: 'Top destinations', exact: true })).toBeVisible();
        await expect(button(page, 'Shanghai (上海)')).toHaveCount(1);
        await button(page, 'Shanghai (上海)').click();
        await expect(page.getByPlaceholder('From', { exact: true })).toHaveValue('Shanghai');
    }
});
test("REQ-3.1.1: Choose Beijing from alphabetical selector", async ({ page }) => {
    await entry(page);
    await page.getByPlaceholder('From', { exact: true }).click();
    for (const name of ['Popular', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'])
        await expect(page.getByRole('tab', { name, exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'ABCDE', exact: true }).click();
    await expect(button(page, 'Beijing (北京)')).toHaveCount(1);
    await button(page, 'Beijing (北京)').click();
    await expect(page.getByPlaceholder('From', { exact: true })).toHaveValue('Beijing');
});
