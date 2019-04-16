import '@babel/polyfill';
import {
  estimateGas,
  estimateGasLimit,
  getGasPrice,
  getTransactionCount,
  toChecksumAddress,
  toHex,
} from '../web3_ethers'

const estimateGasData = {
  from: '0x1492004547FF0eFd778CC2c14E794B26B4701105',
  to: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  data: '0xa9059cbb0000000000000000000000001492004547ff0efd778cc2c14e794b26b4701105000000000000000000000000000000000000000000000000002386f26fc10000',
  value: '0x0',
}

const estimateGasDataToEns = {
  from: '0x1492004547FF0eFd778CC2c14E794B26B4701105',
  to: 'jinrummie.eth',
  data: '0x',
  value: '0x0',
}

test('toChecksumAddress', async () => {
  const address = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const expectedResult = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await toChecksumAddress(address);
  expect(result).toBe(expectedResult);
});

test('toChecksumAddressAllCaps', async () => {
  const address = '0x1492004547FF0EFd778CC2C14E794B26B4701105';
  const expectedResult = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await toChecksumAddress(address);
  expect(result).toBeNull();
});

test('toChecksumAddressRandomCapitalization', async () => {
  const address = '0x1492004547Ff0eFd778cc2c14E794b26b4701105';
  const result = await toChecksumAddress(address);
  expect(result).toBeNull();
});

test('toChecksumInvalidAddress', async () => {
  const address = '0x1ab2004547ff0efd778cc2c14e';
  const result = await toChecksumAddress(address);
  expect(result).toBeNull();
});

test('getGasPrice', async () => {
  const result = await getGasPrice();
  expect(result).toBeGreaterThan(0);
});

test('estimateGas', async () => {
  const result = await estimateGas(estimateGasData);
  expect(result).toBe(37170);
});

test('estimateGasToEns', async () => {
  const result = await estimateGas(estimateGasDataToEns);
  expect(result).toBe(21000);
});

test('toHex', () => {
  const result = toHex(37170);
  expect(result).toBe('0x9132');
});

test('getTransactionCount', async () => {
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await getTransactionCount(address, 'pending');
  expect(result).toBeGreaterThan(500);
});

test('estimateGasLimitForNormalEthTransferToEns', async () => {
  const amount = '0.01';
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = 'jinrummie.eth';
	const asset = {
		name: 'Ethereum',
		symbol: 'ETH',
		address: null,
		decimals: 18,
	};
  const gasLimit = await estimateGasLimit({
    asset,
    address,
    recipient,
    amount,
  });
  expect(gasLimit).toBe(21000);
});

test('estimateGasLimitForNormalEthTransfer', async () => {
  const amount = '0.01';
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
	const asset = {
		name: 'Ethereum',
		symbol: 'ETH',
		address: null,
		decimals: 18,
	};
  const gasLimit = await estimateGasLimit({
    asset,
    address,
    recipient,
    amount,
  });
  expect(gasLimit).toBe(21000);
});

test('estimateGasLimitForTokenTransfer', async () => {
  const amount = '0.01';
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
	const asset = {
		name: 'MKR',
		symbol: 'MKR',
		address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		decimals: 18,
	};
  const gasLimit = await estimateGasLimit({
    asset,
    address,
    recipient,
    amount,
  });
  expect(gasLimit).toBe(37170);
});

test('estimateGasLimitForEthToContract', async () => {
  const amount = '0.01';
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = '0x7527939E6E62dc281954d212535E9612d63Dfd96';
	const asset = {
		name: 'Ethereum',
		symbol: 'ETH',
		address: null,
		decimals: 18,
	};
  const gasLimit = await estimateGasLimit({
    asset,
    address,
    recipient,
    amount,
  });
  expect(gasLimit).toBe(21040);
});
