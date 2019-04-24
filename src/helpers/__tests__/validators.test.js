import '@babel/polyfill';
import { isValidAddress } from '../validators'

test('isValidAddress', async () => {
  const result = await isValidAddress('0x1492004547FF0eFd778CC2c14E794B26B4701105');
  expect(result).toBe(true);
});

test('isValidAddressIncorrectCaps', async () => {
  const result = await isValidAddress('0x1492004547fF0efd778CC2c14E794B26B4701105');
  expect(result).toBe(false);
});

test('isValidAddressAllCaps', async () => {
  const result = await isValidAddress('0x1492004547FF0EFD778CC2C14E794B26B4701105');
  expect(result).toBe(true);
});

test('isValidAddressAllLowercase', async () => {
  const result = await isValidAddress('0x1492004547ff0efd778cc2c14e794b26b4701105');
  expect(result).toBe(true);
});

test('isValidZeroAddress', async () => {
  const result = await isValidAddress('0x0000000000000000000000000000000000000000');
  expect(result).toBe(true);
});

test('isValidENS', async () => {
  const result = await isValidAddress('jinrummie.eth');
  expect(result).toBe(true);
});

test('isValidENSNoResolver', async () => {
  const result = await isValidAddress('vitalik.eth');
  expect(result).toBe(false);
});

test('isInvalidENS', async () => {
  const result = await isValidAddress('123.eth');
  expect(result).toBe(false);
});

test('isInvalidRandomString', async () => {
  const result = await isValidAddress('hello');
  expect(result).toBe(false);
});

test('isInvalid0xAddress', async () => {
  const result = await isValidAddress('0x1234');
  expect(result).toBe(false);
});

test('isInvalidRandomNumbers', async () => {
  const result = await isValidAddress('818472');
  expect(result).toBe(false);
});
