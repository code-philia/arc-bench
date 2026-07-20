import { expect, Locator, Page } from '@playwright/test';

type MatchInput = string | RegExp | Array<string | RegExp>;
type Scope = Page | Locator;

export const FIXTURES = {
  auth: {
    username: 'ctrip_user',
    email: 'ctrip_user@example.com',
    mobile: '13800000010',
    password: 'Travel1234',
    newPassword: 'Travel5678',
    smsMobile: '13800000011',
    smsCode: '123456',
  },
  registration: {
    mobile: '13800000012',
    code: '123456',
    password: 'Travel1234',
    weakPassword: '1234567',
  },
  flightSearch: {
    from: '成都',
    fromFilled: '成都(CTU)',
    to: '广州',
    toFilled: '广州(CAN)',
    sameCity: '成都',
    date: '2026-07-21',
    nearbyDate: '2026-07-22',
    returnDate: '2026-07-25',
    earlierReturnDate: '2026-07-20',
    noResultFrom: '北海',
    noResultTo: '火星城',
    noResultDate: '2026-07-23',
    historyLabel: '成都 - 广州',
    flightNumber: 'JD5162',
  },
  booking: {
    travelerName: '张三',
    secondTravelerName: '李四',
    validIdNumber: '110101199001011234',
    invalidIdNumber: '123',
    mobile: '13800000014',
    orderNumber: 'CTRIP20260721001',
  },
  profile: {
    displayName: '携程用户',
    updatedDisplayName: '携程用户已更新',
    maskedMobile: '138****0019',
    maskedEmail: 'pro***@example.com',
    newPhone: '13800000020',
    newEmail: 'profile_user_next@example.com',
  },
  address: {
    consignee: '张三',
    city: '上海',
    district: '浦东新区',
    detail: '世纪大道100号',
  },
  contact: {
    name: '张三',
    secondName: '李四',
    mobile: '13800000017',
  },
  invoice: {
    title: '上海示例科技有限公司',
    taxId: '91310000123456789A',
    address: '上海市浦东新区示例路8号',
    phone: '021-12345678',
    bank: '中国银行上海分行',
    bankAccount: '6222000000000000000',
  },
  airport: {
    popular: ['北京首都', '上海浦东', '广州白云'],
    domesticAnchor: '国内机场',
    internationalAnchor: '国际/中国港澳台地区',
  },
} as const;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPatterns(value: MatchInput): RegExp[] {
  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => {
    if (item instanceof RegExp) return item;
    return new RegExp(escapeRegExp(item).replace(/\s+/g, '\\s+'), 'i');
  });
}

function target(scope: Scope): any {
  return scope as any;
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
  for (const locator of locators) {
    const candidate = locator.first();
    try {
      if (await candidate.count()) return candidate;
    } catch {
      // continue
    }
  }
  return locators[0].first();
}

function namedLocators(scope: Scope, pattern: RegExp): Locator[] {
  const t = target(scope);
  return [
    t.getByRole('button', { name: pattern }),
    t.getByRole('link', { name: pattern }),
    t.getByRole('tab', { name: pattern }),
    t.getByRole('menuitem', { name: pattern }),
    t.getByRole('option', { name: pattern }),
    t.getByRole('radio', { name: pattern }),
    t.getByRole('checkbox', { name: pattern }),
    t.getByRole('heading', { name: pattern }),
    t.getByText(pattern),
  ];
}

function fieldLocators(scope: Scope, pattern: RegExp): Locator[] {
  const t = target(scope);
  return [
    t.getByLabel(pattern),
    t.getByPlaceholder(pattern),
    t.getByRole('textbox', { name: pattern }),
    t.getByRole('searchbox', { name: pattern }),
    t.getByRole('combobox', { name: pattern }),
    t.getByRole('spinbutton', { name: pattern }),
  ];
}

async function resolveNamed(scope: Scope, value: MatchInput): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible(namedLocators(scope, pattern));
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible(namedLocators(scope, patterns[0]));
}

async function resolveField(scope: Scope, value: MatchInput): Promise<Locator> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible(fieldLocators(scope, pattern));
    try {
      if (await locator.isVisible({ timeout: 200 })) return locator;
    } catch {
      // continue
    }
  }
  return firstVisible(fieldLocators(scope, patterns[0]));
}

export async function isVisible(scope: Scope, value: MatchInput): Promise<boolean> {
  try {
    const locator = await resolveNamed(scope, value);
    return await locator.isVisible({ timeout: 300 });
  } catch {
    return false;
  }
}

export async function openHome(page: Page): Promise<void> {
  await page.goto('/');
}

export async function clickNamed(scope: Scope, value: MatchInput): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await locator.click();
}

export async function clickIfVisible(scope: Scope, value: MatchInput): Promise<boolean> {
  try {
    const locator = await resolveNamed(scope, value);
    if (await locator.isVisible({ timeout: 300 })) {
      await locator.click();
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export async function clickFirstAvailable(scope: Scope, values: MatchInput[]): Promise<void> {
  for (const value of values) {
    if (await clickIfVisible(scope, value)) return;
  }
  await clickNamed(scope, values[0]);
}

export async function hoverIfVisible(scope: Scope, value: MatchInput): Promise<boolean> {
  try {
    const locator = await resolveNamed(scope, value);
    if (await locator.isVisible({ timeout: 300 })) {
      await locator.hover();
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export async function expectVisible(scope: Scope, value: MatchInput): Promise<void> {
  const locator = await resolveNamed(scope, value);
  await expect(locator).toBeVisible();
}

export async function expectAnyVisible(scope: Scope, values: MatchInput[]): Promise<void> {
  for (const value of values) {
    await expectVisible(scope, value);
  }
}

export async function fillField(scope: Scope, labelOrPlaceholder: MatchInput, value: string): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.fill(value);
}

export async function clickField(scope: Scope, labelOrPlaceholder: MatchInput): Promise<void> {
  const locator = await resolveField(scope, labelOrPlaceholder);
  await locator.click();
}

export async function setCheckbox(scope: Scope, value: MatchInput, checked: boolean): Promise<void> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible([
      target(scope).getByRole('checkbox', { name: pattern }),
      target(scope).getByLabel(pattern),
    ]);
    try {
      if (await locator.isVisible({ timeout: 300 })) {
        if (checked) {
          await locator.check();
        } else {
          await locator.uncheck();
        }
        return;
      }
    } catch {
      // continue
    }
  }
  const locator = await firstVisible([
    target(scope).getByRole('checkbox'),
    target(scope).locator('input[type="checkbox"]'),
  ]);
  if (checked) {
    await locator.check();
  } else {
    await locator.uncheck();
  }
}

export async function setCheckboxIfVisible(scope: Scope, value: MatchInput, checked: boolean): Promise<boolean> {
  try {
    await setCheckbox(scope, value, checked);
    return true;
  } catch {
    return false;
  }
}

export async function setRadio(scope: Scope, value: MatchInput): Promise<void> {
  const patterns = toPatterns(value);
  for (const pattern of patterns) {
    const locator = await firstVisible([
      target(scope).getByRole('radio', { name: pattern }),
      target(scope).getByLabel(pattern),
    ]);
    try {
      if (await locator.isVisible({ timeout: 300 })) {
        await locator.check();
        return;
      }
    } catch {
      // continue
    }
  }
  await clickNamed(scope, value);
}

export async function chooseOption(scope: Scope, label: MatchInput, option: MatchInput): Promise<void> {
  const field = await resolveField(scope, label);
  try {
    const optionValue = Array.isArray(option) ? option.find((value) => typeof value === 'string') : option;
    if (typeof optionValue === 'string') {
      await field.selectOption({ label: optionValue });
      return;
    }
  } catch {
    // fall back to popup selection
  }
  await field.click();
  await clickNamed(scope, option);
}

export async function expectFieldValue(scope: Scope, field: MatchInput, expected: MatchInput): Promise<void> {
  const locator = await resolveField(scope, field);
  const patterns = toPatterns(expected);
  const value = await locator.inputValue();
  if (!patterns.some((pattern) => pattern.test(value))) {
    throw new Error(`Expected field value to match ${patterns.map((item) => item.source).join(', ')}, got: ${value}`);
  }
}

export async function expectTextValue(scope: Scope, expected: MatchInput): Promise<void> {
  await expectVisible(scope, expected);
}

export async function confirmDialog(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/确定/, /确认/, /继续/], [/confirm/i], [/ok/i]]);
}

export async function cancelDialog(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/取消/, /关闭/, /不同意/], [/cancel/i], [/close/i]]);
}

export async function expectSuccessFeedback(page: Page): Promise<void> {
  await expectAnyVisible(page, [[/成功/, /已保存/, /已完成/], [/success/i, /saved/i, /completed/i]]);
}

export async function expectErrorFeedback(page: Page, text: MatchInput): Promise<void> {
  await expectVisible(page, text);
}

export async function expectHome(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/登录/, /^login$/i, /sign in/i],
    [/注册/, /register/i, /sign up/i],
    [/搜索/, /^search$/i],
  ]);
}

export async function openLoginPage(page: Page): Promise<void> {
  await openHome(page);
  await clickFirstAvailable(page, [[/登录/, /^login$/i, /sign in/i]]);
}

export async function expectPasswordLoginForm(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/邮箱.*用户名.*手机号/, /email.*username.*mobile/i, /account/i],
    [/密码/, /password/i],
    [/登录/, /^login$/i, /sign in/i],
  ]);
}

export async function ensurePasswordLogin(page: Page): Promise<void> {
  await openLoginPage(page);
  await clickIfVisible(page, [/账号登录/, /password login/i]);
  await expectPasswordLoginForm(page);
}

export async function ensureCodeLogin(page: Page): Promise<void> {
  await openLoginPage(page);
  await clickIfVisible(page, [/验证码登录/, /verification.?code login/i, /sms login/i]);
  await expectAnyVisible(page, [
    [/手机号/, /mobile/i],
    [/验证码/, /verification code/i],
    [/发送验证码/, /send code/i],
  ]);
}

export async function setAgreement(page: Page, checked: boolean): Promise<void> {
  await setCheckbox(page, [/协议/, /隐私政策/, /agree/i, /terms/i], checked);
}

export async function fillPasswordLogin(page: Page, account: string, password: string, checkedAgreement = true): Promise<void> {
  await fillField(page, [/邮箱.*用户名.*手机号/, /email.*username.*mobile/i, /account/i], account);
  await fillField(page, [/密码/, /password/i], password);
  if (checkedAgreement) {
    await setAgreement(page, true);
  }
}

export async function submitLogin(page: Page): Promise<void> {
  await clickFirstAvailable(page, [[/登录/, /^login$/i, /sign in/i]]);
}

export async function expectLoggedInState(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/尊敬的/, /我的携程/, /个人中心/, /退出登录/],
  ]);
}

export async function login(page: Page): Promise<void> {
  await ensurePasswordLogin(page);
  await fillPasswordLogin(page, FIXTURES.auth.username, FIXTURES.auth.password, true);
  await submitLogin(page);
}

export async function beginRegistrationFromLogin(page: Page): Promise<void> {
  await openLoginPage(page);
  await clickFirstAvailable(page, [[/免费注册/, /注册/, /register/i, /sign up/i]]);
}

export async function expectRegistrationAgreement(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/携程用户注册协议/, /隐私政策/, /agreement/i, /privacy/i],
    [/同意并继续/, /agree and continue/i],
  ]);
}

export async function reachRegistrationVerifyStep(page: Page): Promise<void> {
  await beginRegistrationFromLogin(page);
  await expectRegistrationAgreement(page);
  await clickFirstAvailable(page, [[/同意并继续/, /agree and continue/i]]);
  await expectAnyVisible(page, [
    [/手机号/, /mobile/i],
    [/验证码/, /verification code/i],
    [/下一步/, /设置密码/, /next/i],
  ]);
}

export async function reachRegistrationPasswordStep(page: Page): Promise<void> {
  await reachRegistrationVerifyStep(page);
  await fillField(page, [/手机号/, /mobile/i], FIXTURES.registration.mobile);
  await clickFirstAvailable(page, [[/发送验证码/, /send code/i]]);
  await expectAnyVisible(page, [[/倒计时/, /重新发送/, /countdown/i, /resend/i]]);
  await fillField(page, [/验证码/, /verification code/i], FIXTURES.registration.code);
  await clickFirstAvailable(page, [[/下一步/, /设置密码/, /next/i]]);
  await expectAnyVisible(page, [
    [/设置密码/, /password/i],
    [/确认密码/, /confirm/i],
  ]);
}

export async function openFlightSearch(page: Page): Promise<void> {
  await openHome(page);
  await clickIfVisible(page, [/机票/, /航班/, /flights/i]);
  await expectAnyVisible(page, [
    [/出发城市/, /出发地/, /from/i, /origin/i],
    [/到达城市/, /目的地/, /to/i, /destination/i],
    [/出发日期/, /departure date/i],
    [/搜索/, /^search$/i],
  ]);
}

export async function fillFlightSearch(page: Page, route = FIXTURES.flightSearch): Promise<void> {
  await fillField(page, [/出发城市/, /出发地/, /from/i, /origin/i], route.from);
  await fillField(page, [/到达城市/, /目的地/, /to/i, /destination/i], route.to);
  await fillField(page, [/出发日期/, /departure date/i], route.date);
}

export async function openFlightResults(page: Page): Promise<void> {
  await openFlightSearch(page);
  await fillFlightSearch(page);
  await clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
}

export async function expectFlightResults(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/航班/, /flight/i],
    [/价格/, /price/i],
    [/筛选/, /filter/i],
  ]);
}

export async function openBookingPage(page: Page): Promise<void> {
  await openFlightResults(page);
  await clickIfVisible(page, [/展开/, /更多舱位/, /详情/, /details/i]);
  await clickFirstAvailable(page, [[/预订/, /订/, /book/i]]);
  await expectBookingPage(page);
}

export async function expectBookingPage(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/乘机人/, /旅客/, /traveler/i, /passenger/i],
    [/联系人手机/, /手机号/, /mobile/i],
    [/订单总价/, /total/i],
  ]);
}

export async function openPaymentPage(page: Page): Promise<void> {
  await openBookingPage(page);
  await clickIfVisible(page, [/张三/, /李四/, /成人/, /adult/i]);
  await clickIfVisible(page, [/已阅读并同意/, /同意/, /agree/i]);
  await clickFirstAvailable(page, [[/提交订单/, /去支付/, /确认订单/, /place order/i, /confirm/i, /next/i]]);
}

export async function expectPaymentPage(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/剩余时间/, /支付/, /countdown/i, /pay/i],
  ]);
}

export async function openUserMenu(page: Page): Promise<void> {
  await login(page);
  await hoverIfVisible(page, [/尊敬的/, /我的携程/, /个人中心/, /account/i]);
}

export async function openOrderCenter(page: Page): Promise<void> {
  await openUserMenu(page);
  await clickFirstAvailable(page, [[/订单中心/, /orders/i]]);
}

export async function openPersonalCenter(page: Page): Promise<void> {
  await openUserMenu(page);
  await clickFirstAvailable(page, [[/个人中心/, /personal center/i]]);
}

export async function expectPersonalCenter(page: Page): Promise<void> {
  await expectAnyVisible(page, [
    [/尊敬的用户/, /个人中心/, /common information/i, /常用信息/],
  ]);
}

export async function expandCommonInformation(page: Page): Promise<void> {
  await openPersonalCenter(page);
  await clickFirstAvailable(page, [[/常用信息/, /common information/i]]);
}

export async function openTravelerManager(page: Page): Promise<void> {
  await expandCommonInformation(page);
  await clickFirstAvailable(page, [[/常用旅客/, /旅客信息/, /traveler/i]]);
}

export async function openAddressManager(page: Page): Promise<void> {
  await expandCommonInformation(page);
  await clickFirstAvailable(page, [[/常用地址/, /address/i]]);
}

export async function openContactManager(page: Page): Promise<void> {
  await expandCommonInformation(page);
  await clickFirstAvailable(page, [[/常用联系人/, /contact/i]]);
}

export async function openInvoiceManager(page: Page): Promise<void> {
  await expandCommonInformation(page);
  await clickFirstAvailable(page, [[/常用报销凭证/, /发票抬头/, /invoice/i]]);
}

export async function openProfileOverview(page: Page): Promise<void> {
  await openPersonalCenter(page);
  await clickIfVisible(page, [/个人资料/, /profile/i]);
}

export async function openSecurityCenter(page: Page): Promise<void> {
  await openPersonalCenter(page);
  await clickFirstAvailable(page, [[/安全中心/, /security center/i]]);
}

export async function openFlightStatusPage(page: Page): Promise<void> {
  await openHome(page);
  await clickIfVisible(page, [/机票/, /航班/, /flights/i]);
  await clickIfVisible(page, [/更多服务/, /more services/i]);
  await clickFirstAvailable(page, [[/航班动态/, /flight status/i]]);
}

export async function openVoucherHome(page: Page): Promise<void> {
  await login(page);
  await openHome(page);
  await clickIfVisible(page, [/更多服务/, /more services/i]);
  await clickFirstAvailable(page, [[/报销凭证/, /reimbursement/i, /invoice/i]]);
}

export async function openAirportGuide(page: Page): Promise<void> {
  await openHome(page);
  await clickIfVisible(page, [/机票/, /航班/, /flights/i]);
  await clickIfVisible(page, [/更多服务/, /more services/i]);
  await clickFirstAvailable(page, [[/机场攻略/, /airport guide/i]]);
}

export async function openAirportDetail(page: Page): Promise<void> {
  await openAirportGuide(page);
  await clickFirstAvailable(page, [[/北京首都/], [/上海浦东/], [/广州白云/], [/成都/]]);
}
