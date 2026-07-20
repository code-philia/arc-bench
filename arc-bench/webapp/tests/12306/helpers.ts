import { expect, Locator, Page } from '@playwright/test';

export const FIXTURES = {
  registration: {
    name: 'Test Traveler',
    passportNumber: 'P20260001',
    username: 'traveler_new',
    email: 'traveler_new@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    nationality: 'China',
    passportExpirationDate: '2026-12-31',
    birthDate: '1996-06-18',
    gender: 'Male',
    mobile: '13800000001',
  },
  duplicatePassport: {
    ...{
      name: 'Duplicate Passport',
      passportNumber: 'P20260002',
      username: 'duplicate_passport_user',
      email: 'duplicate_passport_user@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      nationality: 'China',
      passportExpirationDate: '2026-12-31',
      birthDate: '1994-05-21',
      gender: 'Female',
      mobile: '13800000002',
    },
  },
  duplicateUsername: {
    ...{
      name: 'Duplicate Username',
      passportNumber: 'P20260004',
      username: 'username_taken',
      email: 'duplicate_username_user@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      nationality: 'China',
      passportExpirationDate: '2026-12-31',
      birthDate: '1993-04-11',
      gender: 'Female',
      mobile: '13800000003',
    },
  },
  registeredUser: {
    username: 'registered_user',
    email: 'registered_user@example.com',
    mobile: '13800000010',
    passportNumber: 'P20260010',
    password: 'Password123!',
    newPassword: 'Password123!X',
  },
  ordersEmptyUser: {
    username: 'orders_empty_user',
    email: 'orders_empty_user@example.com',
    password: 'Password123!',
  },
  ordersUnpaidUser: {
    username: 'orders_unpaid_user',
    email: 'orders_unpaid_user@example.com',
    password: 'Password123!',
  },
  ordersUpcomingUser: {
    username: 'orders_upcoming_user',
    email: 'orders_upcoming_user@example.com',
    password: 'Password123!',
  },
  ordersHistoryUser: {
    username: 'orders_history_user',
    email: 'orders_history_user@example.com',
    password: 'Password123!',
  },
  ordersCancelledUser: {
    username: 'orders_cancelled_user',
    email: 'orders_cancelled_user@example.com',
    password: 'Password123!',
  },
  resetUser: {
    email: 'reset_user@example.com',
    idNumber: 'P20260011',
    password: 'Password123!',
    newPassword: 'Password123!X',
  },
  personalCenterUser: {
    username: 'personal_center_user',
    email: 'personal_center_user@example.com',
    mobile: '13800000020',
    password: 'Password123!',
  },
  profileUser: {
    username: 'profile_user',
    email: 'profile_user@example.com',
    mobile: '13800000030',
    password: 'Password123!',
    newPassword: 'Password123!X',
    newEmail: 'profile_user_next@example.com',
    newMobile: '13800000031',
  },
  passenger: {
    name: 'Passenger Example',
    passportNumber: 'P20269999',
    passportExpirationDate: '2027-12-31',
    birthDate: '2000-01-15',
    nationality: 'China',
    gender: 'Female',
    email: 'passenger@example.com',
    mobile: '13800000040',
    passengerType: 'Adult',
  },
  passengerManagerUser: {
    username: 'passenger_manager_user',
    email: 'passenger_manager_user@example.com',
    password: 'Password123!',
  },
  bookableUser: {
    username: 'bookable_user',
    email: 'bookable_user@example.com',
    password: 'Password123!',
  },
  searchRoute: {
    from: 'Shanghai',
    to: 'Beijing',
    date: '2026-07-21',
    alternateDate: '2026-07-22',
    fuzzyInput: 'shang',
    selectedLocation: 'Shanghai',
  },
  emptyRoute: {
    from: 'Ghost City',
    to: 'Nowhere',
    date: '2026-07-21',
  },
  transferRoute: {
    from: 'Yancheng',
    to: 'Lhasa',
    date: '2026-07-22',
  },
  orderKeyword: 'G1001',
} as const;

type NamedAccount = {
  username?: string;
  email?: string;
  mobile?: string;
  password: string;
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function toPattern(value: string | RegExp): RegExp {
  if (value instanceof RegExp) return value;
  return new RegExp(escapeRegExp(value).replace(/\s+/g, '\\s+'), 'i');
}

async function firstVisible(locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.isVisible({ timeout: 500 })) return candidate;
    } catch {
      // continue
    }
  }
  return locators[0].first();
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function clickNamed(page: Page, value: string | RegExp): Promise<void> {
  const name = toPattern(value);
  const locator = await firstVisible([
    page.getByRole('button', { name }),
    page.getByRole('link', { name }),
    page.getByRole('tab', { name }),
    page.getByRole('menuitem', { name }),
    page.getByRole('option', { name }),
    page.getByText(name),
  ]);
  await locator.click();
}

export async function hoverNamed(page: Page, value: string | RegExp): Promise<void> {
  const name = toPattern(value);
  const locator = await firstVisible([
    page.getByRole('button', { name }),
    page.getByRole('link', { name }),
    page.getByText(name),
  ]);
  await locator.hover();
}

export async function expectTextsVisible(page: Page, values: Array<string | RegExp>): Promise<void> {
  for (const value of values) {
    const name = toPattern(value);
    const locator = await firstVisible([
      page.getByRole('heading', { name }),
      page.getByRole('button', { name }),
      page.getByRole('link', { name }),
      page.getByRole('tab', { name }),
      page.getByRole('cell', { name }),
      page.getByText(name),
      page.getByLabel(name),
      page.getByPlaceholder(name),
    ]);
    await expect(locator).toBeVisible();
  }
}

export async function expectSuccessFeedback(page: Page): Promise<void> {
  const locator = await firstVisible([
    page.getByRole('alert'),
    page.getByRole('status'),
    page.getByText(/success|successful|succeeded|completed|submitted/i),
  ]);
  await expect(locator).toBeVisible();
}

export async function expectErrorFeedback(page: Page, text: string): Promise<void> {
  const locator = await firstVisible([
    page.getByRole('alert', { name: toPattern(text) }),
    page.getByRole('status', { name: toPattern(text) }),
    page.getByText(toPattern(text)),
  ]);
  await expect(locator).toBeVisible();
}

export async function fillField(page: Page, labelOrPlaceholder: string, value: string): Promise<void> {
  const name = toPattern(labelOrPlaceholder);
  const locator = await firstVisible([
    page.getByLabel(name),
    page.getByPlaceholder(name),
    page.getByRole('textbox', { name }),
    page.getByRole('combobox', { name }),
    page.getByRole('spinbutton', { name }),
  ]);
  await locator.fill(value);
}

export async function setCheckboxByText(page: Page, text: string, checked: boolean): Promise<void> {
  const name = toPattern(text);
  const locator = await firstVisible([
    page.getByRole('checkbox', { name }),
    page.getByLabel(name),
  ]);
  if (checked) {
    await locator.check();
  } else {
    await locator.uncheck();
  }
}

export async function selectRadio(page: Page, value: string): Promise<void> {
  const name = toPattern(value);
  const locator = await firstVisible([
    page.getByRole('radio', { name }),
    page.getByLabel(name),
  ]);
  await locator.check();
}

export async function selectOption(page: Page, label: string, option: string): Promise<void> {
  const control = await firstVisible([
    page.getByLabel(toPattern(label)),
    page.getByRole('combobox', { name: toPattern(label) }),
  ]);
  try {
    await control.selectOption({ label: option });
    return;
  } catch {
    await control.click();
  }
  await clickNamed(page, option);
}

export async function openRegistrationPage(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /register/i);
}

export async function expectRegistrationForm(page: Page): Promise<void> {
  await expectTextsVisible(page, [
    'Nationality',
    'Name',
    'Passport number',
    'Passport expiration date',
    'Date of birth',
    'Gender',
    'Username',
    'Password',
    'Confirm Password',
    'Email address',
    'Register',
  ]);
}

export async function fillRegistrationForm(page: Page, variant: 'valid' | 'duplicatePassport' | 'duplicateUsername' | 'mismatch' | 'invalidEmail' | 'missing' | 'noAgreement'): Promise<void> {
  const source =
    variant === 'duplicatePassport'
      ? FIXTURES.duplicatePassport
      : variant === 'duplicateUsername'
        ? FIXTURES.duplicateUsername
        : FIXTURES.registration;
  if (variant !== 'missing') {
    await selectOption(page, 'Nationality', source.nationality);
    await fillField(page, 'Name', source.name);
    await fillField(page, 'Passport number', source.passportNumber);
    await fillField(page, 'Passport expiration date', source.passportExpirationDate);
    await fillField(page, 'Date of birth', source.birthDate);
    await selectRadio(page, source.gender);
    await fillField(page, 'Username', source.username);
    await fillField(page, 'Email address', variant === 'invalidEmail' ? 'invalid-email' : source.email);
  }
  await fillField(page, 'Password', source.password);
  await fillField(page, 'Confirm Password', variant === 'mismatch' ? 'Password123!Mismatch' : source.confirmPassword);
  if (variant !== 'noAgreement') {
    await setCheckboxByText(page, 'I have read and agree', true);
  }
}

export async function openLoginPage(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /login/i);
}

export async function expectLoginForm(page: Page): Promise<void> {
  await expectTextsVisible(page, ['Email/Username/Mobile number', 'Password', 'LOGIN']);
}

export async function fillLoginForm(page: Page, account: string, password: string): Promise<void> {
  await fillField(page, 'Email/Username/Mobile number', account);
  await fillField(page, 'Password', password);
}

export async function loginAs(page: Page, account: NamedAccount = FIXTURES.registeredUser): Promise<void> {
  await openLoginPage(page);
  const accountValue = account.username ?? account.email ?? account.mobile ?? '';
  await fillLoginForm(page, accountValue, account.password);
  await clickNamed(page, 'LOGIN');
}

export async function logout(page: Page): Promise<void> {
  await clickNamed(page, /sign out/i);
}

export async function openForgotPasswordPage(page: Page): Promise<void> {
  await openLoginPage(page);
  await clickNamed(page, /forgot password\?/i);
}

export async function expectForgotPasswordPage(page: Page): Promise<void> {
  await expectTextsVisible(page, ['Email', 'ID number', 'submit']);
}

export async function fillForgotPasswordStepOne(page: Page, email: string, idNumber: string): Promise<void> {
  await fillField(page, 'Email', email);
  await fillField(page, 'ID number', idNumber);
}

export async function fillForgotPasswordStepTwo(page: Page, password: string, confirmPassword: string): Promise<void> {
  await fillField(page, 'New password', password);
  await fillField(page, 'Confirm new password', confirmPassword);
}

export async function expectQuickSearch(page: Page): Promise<void> {
  await expectTextsVisible(page, ['From', 'To', 'Date', 'Search']);
}

export async function searchTickets(page: Page, route = FIXTURES.searchRoute): Promise<void> {
  await openHome(page);
  await fillField(page, 'From', route.from);
  await fillField(page, 'To', route.to);
  await fillField(page, 'Date', route.date);
  await clickNamed(page, 'Search');
}

export async function openSearchResults(page: Page): Promise<void> {
  await searchTickets(page);
}

export async function openTransferResults(page: Page): Promise<void> {
  await openHome(page);
  await fillField(page, 'From', FIXTURES.transferRoute.from);
  await fillField(page, 'To', FIXTURES.transferRoute.to);
  await fillField(page, 'Date', FIXTURES.transferRoute.date);
  await clickNamed(page, 'Search');
}

export async function openPersonalCenter(page: Page, account: NamedAccount = FIXTURES.personalCenterUser): Promise<void> {
  await loginAs(page, account);
  await clickNamed(page, /my 12306/i);
}

export async function openTicketOrders(page: Page, account: NamedAccount = FIXTURES.personalCenterUser): Promise<void> {
  await openPersonalCenter(page, account);
  await clickNamed(page, /order center/i);
  await clickNamed(page, /ticket orders/i);
}

export async function openUserInformation(page: Page): Promise<void> {
  await openPersonalCenter(page, FIXTURES.profileUser);
  await clickNamed(page, /personal/i);
  await clickNamed(page, /user information/i);
}

export async function openAccountSecurity(page: Page): Promise<void> {
  await openPersonalCenter(page, FIXTURES.profileUser);
  await clickNamed(page, /personal/i);
  await clickNamed(page, /account security/i);
}

export async function openMyPassengers(page: Page): Promise<void> {
  await openPersonalCenter(page, FIXTURES.passengerManagerUser);
  await clickNamed(page, /information management/i);
  await clickNamed(page, /my passengers/i);
}

export async function openBookingForm(page: Page, authenticated: boolean): Promise<void> {
  if (authenticated) {
    await loginAs(page, FIXTURES.bookableUser);
  }
  await openSearchResults(page);
  await clickNamed(page, /book/i);
}

export async function selectPassengerForBooking(page: Page): Promise<void> {
  const checkbox = page.getByRole('checkbox').nth(1);
  await checkbox.check();
}

export async function reachPaymentPage(page: Page): Promise<void> {
  await openBookingForm(page, true);
  await selectPassengerForBooking(page);
  await clickNamed(page, /place order/i);
  await clickNamed(page, /confirm/i);
}

export async function openTravelGuide(page: Page): Promise<void> {
  await openHome(page);
  await clickNamed(page, /travel guide/i);
}

export async function assertUrlChanged(page: Page): Promise<void> {
  await expect(page).not.toHaveURL(/\/$/);
}

export async function assertResultsPage(page: Page): Promise<void> {
  await expectTextsVisible(page, [
    'Search',
    'Train No.',
    'Departure Time',
    'Travel time',
    'Arrival Time',
    'Price',
    'Filter',
  ]);
}

export async function assertSortToggle(page: Page, headerText: string): Promise<void> {
  await clickNamed(page, headerText);
  await expectTextsVisible(page, [headerText]);
  await clickNamed(page, headerText);
  await expectTextsVisible(page, [headerText]);
}

export async function assertFilterInteraction(page: Page, sectionText: string, optionText: string): Promise<void> {
  await expectTextsVisible(page, [sectionText]);
  await clickNamed(page, optionText);
  await expectTextsVisible(page, [optionText]);
}
