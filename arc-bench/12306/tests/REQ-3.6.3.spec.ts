// requirement: REQ-3.6.3
import { test } from './fixtures/test';
import { chooseFilter, entry, expectTrainIds, region, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-3.6.3: Filter arrival station", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseFilter(region(page, 'Filter'), 'To Station', 'Beijing South');
    await expectTrainIds(page, trains.filter(train => train.to_station === 'Beijing South').map(train => train.number));
});
