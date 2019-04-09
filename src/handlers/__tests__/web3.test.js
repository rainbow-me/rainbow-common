import '@babel/polyfill';
import {
  estimateGasLimit
} from '../web3'

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
