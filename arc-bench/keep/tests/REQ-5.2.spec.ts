// requirement: REQ-5.2
import { test, expect, action, note, section, bounds, openHome, createNote, expectNote } from './helpers';
import { identity } from './fixtures/data';

test('REQ-5.2: Switch grid to list and back', async ({ page }, info) => {
  await openHome(page);
  await expect(action(page, 'List view')).toBeVisible();
  await expect(section(page, 'Notes')).toHaveAccessibleDescription(/Grid view/i);
  const titles = ['View alpha', 'View beta', 'View gamma'].map(example => identity(info, example));
  for (const title of titles) await createNote(page, title, 'Layout content');
  await action(page, 'List view').click();
  await expect(action(page, 'Grid view')).toBeVisible();
  await expect(section(page, 'Notes')).toHaveAccessibleDescription(/List view/i);
  // Responsive geometry is observed without prescribing a DOM or exact widths.
  await expect(async () => {
    const boxes = [];
    for (const title of titles) boxes.push(await bounds(note(page, title)));
    expect(Math.max(...boxes.map(b => b.x)) - Math.min(...boxes.map(b => b.x))).toBeLessThan(3);
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      expect(boxes[i].y + boxes[i].height <= boxes[j].y + 3 || boxes[j].y + boxes[j].height <= boxes[i].y + 3).toBe(true);
    }
  }).toPass({ timeout: 10_000 });
  for (const title of titles) await expectNote(page, title, 'Layout content');
  await action(page, 'Grid view').click();
  await expect(action(page, 'List view')).toBeVisible();
  await expect(section(page, 'Notes')).toHaveAccessibleDescription(/Grid view/i);
  for (const title of titles) await expectNote(page, title, 'Layout content');
});
