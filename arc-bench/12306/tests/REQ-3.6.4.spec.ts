// requirement: REQ-3.6.4
import { test } from './fixtures/test';
import { chooseFilter, entry, expectTrainIds, region, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-3.6.4: Filter morning departures", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseFilter(region(page, 'Filter'), 'Departure time', '06:00-12:00');
    await expectTrainIds(page, trains.filter(train => train.departure >= '06:00' && train.departure < '12:00').map(train => train.number));
});
