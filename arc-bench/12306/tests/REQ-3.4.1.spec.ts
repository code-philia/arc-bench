// requirement: REQ-3.4.1
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, chooseDepartureDate, entry, expectTrainIds, field, search } from './helpers';
import { additionalTrain, trains } from './fixtures/data';
test("REQ-3.4.1: Change date using date picker", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseDepartureDate(page, travelDate(page, 1));
    await button(page, 'Search').click();
    await expect(field(page, 'Date')).toHaveValue(travelDate(page, 1));
    await expectTrainIds(page, [...trains.map(train => train.number), additionalTrain]);
});
