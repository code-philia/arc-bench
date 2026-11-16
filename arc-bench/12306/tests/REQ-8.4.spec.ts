// requirement: REQ-8.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, payment, region } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.4: Show consistent payment and running countdown", async ({ page }) => {
    await entry(page);
    const journey = await payment(page, bookingAccounts.payment);
    const lockNotice = page.getByText(/\bSeats are locked\b/i).filter({ visible: true });
    await expect(lockNotice).toBeVisible();
    const d = region(page, 'Order details');
    for (const value of [journey.train, journey.passenger.name, journey.passenger.passport, 'Business-class seat'])
        await expect(d).toContainText(value);
    const total = page.getByText(/^Total(?:\s+price)?\s*:?\s*(?:[￥¥]|CNY)\s*1,?870\.00$/i);
    await expect(total).toBeVisible();
    const duration = /^\d{2}:\d{2}$/;
    const countdown = region(page, 'Payment countdown');
    const c = countdown.filter({ hasText: duration }).or(countdown.getByText(duration))
        .or(lockNotice.getByText(duration)).filter({ visible: true });
    await expect(c).toHaveText(/^\d{2}:\d{2}$/);
    const seconds = (s: string) => { const [m, v] = s.trim().split(':').map(Number); expect(v).toBeLessThan(60); return m * 60 + v; };
    const initial = seconds(await c.innerText());
    expect(initial).toBeGreaterThanOrEqual(1180);
    expect(initial).toBeLessThanOrEqual(1200);
    const observedAt = performance.now();
    await expect.poll(async () => seconds(await c.innerText()), { timeout: 6000 }).toBeLessThan(initial);
    const before = seconds(await c.innerText());
    const elapsed = (performance.now() - observedAt) / 1000;
    expect(initial - before).toBeLessThanOrEqual(Math.ceil(elapsed) + 1);
    const reloadAt = performance.now();
    await page.reload();
    await expect(c).toHaveText(/^\d{2}:\d{2}$/);
    const after = seconds(await c.innerText());
    expect(after).toBeLessThanOrEqual(before);
    expect(before - after).toBeLessThanOrEqual(Math.ceil((performance.now() - reloadAt) / 1000) + 1);
});
