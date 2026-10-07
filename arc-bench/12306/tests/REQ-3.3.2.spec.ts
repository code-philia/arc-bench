// requirement: REQ-3.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, text, search, expectTrainIds, trains } from './helpers';
test("REQ-3.3.2: Show no direct trains", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Lhasa');
    await expect(page.getByPlaceholder('From', { exact: true })).toHaveValue('Shanghai');
    await expect(page.getByPlaceholder('To', { exact: true })).toHaveValue('Lhasa');
    await expect(field(page, 'Date')).toHaveValue('2026-07-21');
    await expect(page.getByRole('img', { name: 'No trains', exact: true })).toBeVisible();
    await text(page, '0 results');
    await text(page, 'sorry, according to your inquiry condition, there is no train at present.');
    await expectTrainIds(page, []);
});
