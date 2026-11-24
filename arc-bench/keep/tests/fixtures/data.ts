import { createHash, randomBytes } from 'node:crypto';
export function noteInput() {
  const token = randomBytes(12).toString('hex');
  const key = (purpose: string) => createHash('sha256').update(token).update(purpose).digest('hex').slice(0, 16);
  return {
    name: (purpose: string) => `Field ${key(purpose)}`,
    body: (purpose: string) => `Inspect station ${key(purpose)}${purpose.includes('\n') ? '\nRecord the readings' : ''}`,
  };
}

export function keywordInput() {
  const keyword = 'trail' + randomBytes(8).toString('hex');
  const input = noteInput();
  return {
    keyword,
    titleMatch: { title: keyword.toUpperCase() + ' ' + input.name('route'), body: input.body('prepare route') },
    contentMatch: { title: input.name('dispatch'), body: 'Record ' + keyword.toUpperCase() + ' at noon' },
    other: { title: input.name('inventory'), body: input.body('count supplies') },
  };
}
