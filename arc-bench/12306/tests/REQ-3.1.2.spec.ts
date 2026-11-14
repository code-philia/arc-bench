// requirement: REQ-3.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, heading, stationOption, tab } from './helpers';
test("REQ-3.1.2: Choose Shanghai using pinyin and Chinese", async ({ page }) => {
    await entry(page);
    for (const query of ['shang', '上海']) {
        await field(page, 'From').fill(query);
        await expect(heading(page, 'Top destinations')).toBeVisible();
        await expect(stationOption(page, 'Shanghai (上海)')).toHaveCount(1);
        await stationOption(page, 'Shanghai (上海)').click();
        await expect(field(page, 'From')).toHaveValue('Shanghai');
    }
});
test("REQ-3.1.2: Choose Beijing from alphabetical selector", async ({ page }) => {
    await entry(page);
    await field(page, 'From').click();
    for (const name of ['Popular', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'])
        await expect(tab(page, name)).toBeVisible();
    await tab(page, 'ABCDE').click();
    await expect(stationOption(page, 'Beijing (北京)')).toHaveCount(1);
    await stationOption(page, 'Beijing (北京)').click();
    await expect(field(page, 'From')).toHaveValue('Beijing');
});
