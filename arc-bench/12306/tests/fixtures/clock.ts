export const railwayTimezone = 'Asia/Shanghai';

const calendar = new Intl.DateTimeFormat('en-CA', {
    timeZone: railwayTimezone, year: 'numeric', month: '2-digit', day: '2-digit',
});

export function addDays(date: string, days: number) {
    const shifted = new Date(`${date}T00:00:00Z`);
    shifted.setUTCDate(shifted.getUTCDate() + days);
    return shifted.toISOString().slice(0, 10);
}

export function railwayToday(now = new Date()) {
    const parts = calendar.formatToParts(now);
    return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}
