// requirement: REQ-3.4.2
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { dateChoice, entry, expectTrainIds, field, region, search } from './helpers';
import { additionalTrain, trains } from './fixtures/data';
test("REQ-3.4.2: Change date using Travel dates", async ({ page }) => {
    await entry(page);
    await search(page);
    await dateChoice(region(page, 'Travel dates'), travelDate(page, 1)).click();
    await expect(field(page, 'Date')).toHaveValue(travelDate(page, 1));
    await expectTrainIds(page, [...trains.map(train => train.number), additionalTrain]);
});
