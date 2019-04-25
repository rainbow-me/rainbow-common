import '@babel/polyfill';
import { isENSAddressFormat, isValidAddress } from '../validators'

test('isENSAddressFormat', async () => {
  const address = 'hello.eth';
  const result = await isENSAddressFormat(address);
  expect(result).toBeTruthy();
});

test('isENSAddressFormat2', async () => {
  const address = 'a.b';
  const result = await isENSAddressFormat(address);
  expect(result).toBeTruthy();
});

test('isENSAddressFormat3', async () => {
  const address = 'a.';
  const result = await isENSAddressFormat(address);
  expect(result).toBeFalsy();
});

test('isENSAddressFormat4', async () => {
  const address = '123.456';
  const result = await isENSAddressFormat(address);
  expect(result).toBeTruthy();
});

test('isENSAddressFormat5', async () => {
  const address = '123.456.678';
  const result = await isENSAddressFormat(address);
  expect(result).toBeTruthy();
});

test('isENSAddressFormat6', async () => {
  const address = '12-.%56.*78';
  const result = await isENSAddressFormat(address);
  expect(result).toBeTruthy();
});

test('isENSAddressFormat7', async () => {
  const address = '.';
  const result = await isENSAddressFormat(address);
  expect(result).toBeFalsy();
});

test('isENSAddressFormat8', async () => {
  const address = '.b';
  const result = await isENSAddressFormat(address);
  expect(result).toBeFalsy();
});

test('isENSAddressFormat9', async () => {
  const address = 'abc';
  const result = await isENSAddressFormat(address);
  expect(result).toBeFalsy();
});

test('isValidAddress', async () => {
  const result = await isValidAddress('0x1492004547FF0eFd778CC2c14E794B26B4701105');
  expect(result).toBeTruthy();
});

test('isValidAddressIncorrectCaps', async () => {
  const result = await isValidAddress('0x1492004547fF0efd778CC2c14E794B26B4701105');
  expect(result).toBeFalsy();
});

test('isValidAddressAllCaps', async () => {
  const result = await isValidAddress('0x1492004547FF0EFD778CC2C14E794B26B4701105');
  expect(result).toBeTruthy();
});

test('isValidAddressAllLowercase', async () => {
  const result = await isValidAddress('0x1492004547ff0efd778cc2c14e794b26b4701105');
  expect(result).toBeTruthy();
});

test('isValidZeroAddress', async () => {
  const result = await isValidAddress('0x0000000000000000000000000000000000000000');
  expect(result).toBeTruthy();
});

test('isValidENS', async () => {
  const result = await isValidAddress('jinrummie.eth');
  expect(result).toBeTruthy();
});

test('isValidENSNoResolver', async () => {
  const result = await isValidAddress('vitalik.eth');
  expect(result).toBeFalsy();
});

test('isInvalidENS', async () => {
  const result = await isValidAddress('123.eth');
  expect(result).toBeFalsy();
});

test('isInvalidRandomString', async () => {
  const result = await isValidAddress('hello');
  expect(result).toBeFalsy();
});

test('isInvalid0xAddress', async () => {
  const result = await isValidAddress('0x1234');
  expect(result).toBeFalsy();
});

test('isInvalidRandomNumbers', async () => {
  const result = await isValidAddress('818472');
  expect(result).toBeFalsy();
});
