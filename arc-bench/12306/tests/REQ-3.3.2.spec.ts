// requirement: REQ-3.3.2
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { entry, expectTrainIds, field, picture, search, text } from './helpers';
test("REQ-3.3.2: Show no direct trains", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Lhasa');
    await expect(field(page, 'From')).toHaveValue('Shanghai');
    await expect(field(page, 'To')).toHaveValue('Lhasa');
    await expect(field(page, 'Date')).toHaveValue(travelDate(page));
    await expect(picture(page, 'No trains')).toBeVisible();
    await text(page, '0 results');
    await text(page, 'sorry, according to your inquiry condition, there is no train at present.');
    await expectTrainIds(page, []);
});
