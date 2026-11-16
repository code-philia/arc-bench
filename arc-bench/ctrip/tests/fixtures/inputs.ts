import { randomBytes, randomInt } from 'node:crypto';

export function uniqueName(prefix: string): string {
  return `${prefix} ${randomBytes(5).toString('hex')}`;
}

export function newMobile(): string {
  return `139${randomInt(100_000_000).toString().padStart(8, '0')}`;
}

export function passwordInput(): string {
  return `Trip${randomBytes(6).toString('hex')}9!`;
}

export function accountInput() {
  return { mobile: newMobile(), password: passwordInput() };
}

export function profileInput() {
  return { nickname: uniqueName('Profile'), name: uniqueName('Traveler'), gender: 'Female', birthDate: '1992-05-16' };
}

export function travelerInput(prefix: string) {
  // Preserve the mainland ID checksum and the mask exercised by the original specs.
  const date = new Date(Date.UTC(1990, 0, 1 + randomInt(3650))).toISOString().slice(0, 10).replaceAll('-', '');
  const digits = `110101${date}${randomInt(1, 1000).toString().padStart(3, '0')}`;
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checksum = [...digits].reduce((sum, digit, index) => sum + Number(digit) * weights[index], 0);
  const id = digits + '10X98765432'[checksum % 11];
  return { name: uniqueName(prefix), id, maskedId: `${id.slice(0, 6)}********${id.slice(-4)}` };
}

export function addressInput(prefix: string) {
  return {
    name: uniqueName(prefix),
    city: 'Shanghai',
    district: 'Pudong New Area',
    street: `No. ${randomInt(1, 1000)} Century Avenue`,
    mobile: newMobile(),
  };
}

export function contactInput(prefix: string, isDefault = true) {
  return {
    name: uniqueName(prefix),
    mobile: newMobile(),
    email: `contact-${randomBytes(5).toString('hex')}@example.com`,
    isDefault,
  };
}

export function invoiceInput(prefix: string) {
  // The last character is the unified social credit code checksum.
  const alphabet = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const digits = '91310000' + randomInt(1_000_000_000).toString().padStart(9, '0');
  const checksum = [...digits].reduce((sum, digit, index) => sum + Number(digit) * weights[index], 0);
  return { name: uniqueName(prefix), taxId: digits + alphabet[(31 - checksum % 31) % 31] };
}
