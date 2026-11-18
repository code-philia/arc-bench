import { randomBytes, randomInt } from 'node:crypto';

export function customerInput() {
  const letters = Array.from(randomBytes(5), byte => String.fromCharCode(97 + byte % 26)).join('');
  const key = randomBytes(10).toString('hex');
  return {
    firstName: 'Riley', lastName: 'Lane' + letters, email: 'shopper-' + key + '@example.com',
    password: 'Shop9!' + key, birthdate: '1992-04-' + String(randomInt(10, 28)),
  };
}

export type Customer = ReturnType<typeof customerInput>;

export function addressInput(customer: Customer, prefix = 'Residence') {
  return {
    alias: prefix + ' ' + randomBytes(6).toString('hex'),
    'First name': customer.firstName,
    'Last name': customer.lastName,
    Address: randomInt(100, 900) + ' Harbor Road',
    'Postal code': '200000',
    City: 'Shanghai',
    Country: 'China',
    Phone: '138' + String(randomInt(10_000_000, 100_000_000)),
  };
}

export type Address = ReturnType<typeof addressInput>;
export const replacementStreet = () => randomInt(100, 900) + ' Orchard Lane';
export const wishlistInput = () => 'Reading ' + randomBytes(8).toString('hex');

export function storefrontInput() {
  return {
    search: ['detail', 'Hummingbird detail', 't-shirt'][randomInt(3)],
    minimum: [17, 18, 19, 21][randomInt(4)],
    higherMinimum: randomInt(23, 25),
    quantity: randomInt(4, 7),
    beyondStock: randomInt(51, 100),
  };
}

export const catalog = [
  ['Hummingbird detail t-shirt', 24, 'White'], ['Hummingbird cart t-shirt', 25, 'White'],
  ['Hummingbird checkout-step t-shirt', 26, 'White'], ['Hummingbird order-confirmation t-shirt', 27, 'White'],
  ['Hummingbird order-complete t-shirt', 28, 'White'], ['Hummingbird order-history t-shirt', 29, 'White'],
  ['Hummingbird wishlist t-shirt', 23, 'White'], ['White t-shirt', 22, 'White'], ['Black mug', 12, 'Black'],
  ['Catalog item 1', 11, 'Black'], ['Catalog item 2', 12, 'Black'], ['Catalog item 3', 13, 'Black'], ['Catalog item 4', 14, 'Black'],
] as const;

// Verification is not part of the registration workflow under test.
const verifiedAccounts = [
  'user', 'profile_user',
  'checkout_user', 'checkout_address_user', 'checkout_new_address_user', 'checkout_invoice_user',
  'checkout_6_6_user', 'checkout_6_7_user',
  'address_view_user', 'address_create_user', 'address_edit_user', 'address_delete_user',
  'order_history_user',
  'wishlist_view_user', 'wishlist_create_user', 'wishlist_rename_user',
  'wishlist_delete_user', 'wishlist_remove_user', 'wishlist_cart_user',
] as const;

export type VerifiedAccount = typeof verifiedAccounts[number];

export function verifiedCustomer(account: VerifiedAccount): Customer {
  return {
    firstName: 'Store', lastName: 'User', birthdate: '1995-08-21',
    email: 'prestashop_' + account + '@example.com', password: 'ShopPass123!',
  };
}
