import type { Page } from '@playwright/test';

const shanghaiDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const visitDays = new WeakMap<Page, string>();

export function calendarDate(now: Date, offset = 0): string {
  const parts = shanghaiDay.formatToParts(now);
  const part = (type: string) => Number(parts.find(entry => entry.type === type)?.value);
  const date = new Date(Date.UTC(part('year'), part('month') - 1, part('day') + offset));
  return date.toISOString().slice(0, 10);
}

export function tripDate(page: Page, offset: number): string {
  let today = visitDays.get(page);
  if (!today) {
    today = calendarDate(new Date());
    visitDays.set(page, today);
  }
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
