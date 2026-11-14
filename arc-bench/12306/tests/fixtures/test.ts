import { test as base, type Page } from '@playwright/test';
import { addDays, railwayToday, railwayTimezone } from './clock';

const dates = new WeakMap<Page, string>();
const cleanups = new WeakMap<Page, (() => Promise<void>)[]>();

export function afterTest(page: Page, cleanup: () => Promise<void>) {
    const callbacks = cleanups.get(page);
    if (!callbacks) throw new Error('Cleanup requires the 12306 test fixture');
    callbacks.push(cleanup);
}

export function travelDate(page: Page, offset = 0) {
    const today = dates.get(page);
    if (!today) throw new Error('Travel date requires the 12306 test fixture');
    return addDays(today, offset);
}

export const test = base.extend<{ railwayDate: void }>({
    timezoneId: railwayTimezone,
    railwayDate: [async ({ page }, use) => {
        dates.set(page, railwayToday());
        const callbacks: (() => Promise<void>)[] = [];
        cleanups.set(page, callbacks);
        try {
            await use();
        } finally {
            const failures: unknown[] = [];
            for (const cleanup of callbacks.reverse()) {
                try {
                    await cleanup();
                } catch (error) {
                    failures.push(error);
                }
            }
            if (failures.length) throw new AggregateError(failures, 'Could not restore 12306 order availability');
        }
    }, { auto: true }],
});
