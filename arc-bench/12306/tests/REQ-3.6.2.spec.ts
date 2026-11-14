// requirement: REQ-3.6.2
import { test } from './fixtures/test';
import { chooseFilter, entry, expectTrainIds, region, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-3.6.2: Filter departure station", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseFilter(region(page, 'Filter'), 'From Station', 'Shanghai Hongqiao');
    await expectTrainIds(page, trains.filter(train => train.from_station === 'Shanghai Hongqiao').map(train => train.number));
});
