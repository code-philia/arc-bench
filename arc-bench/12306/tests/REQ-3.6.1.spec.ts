// requirement: REQ-3.6.1
import { test } from './fixtures/test';
import { chooseFilter, entry, expectTrainIds, region, search } from './helpers';
import { trains } from './fixtures/data';

const highSpeed = trains.filter(train => /^[GCD]/.test(train.number)).map(train => train.number);
const other = trains.filter(train => !/^[GCD]/.test(train.number)).map(train => train.number);

test("REQ-3.6.1: Restrict train type", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseFilter(region(page, 'Filter'), 'Train type', 'G/C/D');
    await expectTrainIds(page, highSpeed);
});
test("REQ-3.6.1: Filter Other train types", async ({ page }) => {
    await entry(page);
    await search(page);
    await chooseFilter(region(page, 'Filter'), 'Train type', 'Other');
    await expectTrainIds(page, other);
});
test("REQ-3.6.1: Restore all train types", async ({ page }) => {
    await entry(page);
    await search(page);
    const filters = region(page, 'Filter');
    await chooseFilter(filters, 'Train type', 'G/C/D');
    await expectTrainIds(page, highSpeed);
    await chooseFilter(filters, 'Train type', 'All');
    await expectTrainIds(page, trains.map(train => train.number));
});
