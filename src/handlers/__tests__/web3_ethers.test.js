import '@babel/polyfill';
import {
  createSignableTransaction,
  estimateGas,
  estimateGasLimit,
  getGasPrice,
  getTransactionCount,
  getTransferTokenTransaction,
  isHexString,
  resolveNameOrAddress,
  toChecksumAddress,
  toHex,
  toWei,
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

test('resolveNameOrAddress', async () => {
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await resolveNameOrAddress(address);
  expect(result).toBe(address);
});

test('resolveNameOrAddressEns', async () => {
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await resolveNameOrAddress("jinrummie.eth");
  expect(result).toBe(address);
});

test('resolveNameOrAddressFakeEns', async () => {
  const result = await resolveNameOrAddress("blah");
  expect(result).toBe(null);
});

test('isHexString', () => {
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = isHexString(address);
  expect(result).toBeTruthy();
});

test('isHexStringLowercase', () => {
  const address = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const result = isHexString(address);
  expect(result).toBeTruthy();
});

test('isHexStringNo0x', () => {
  const address = '1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = isHexString(address);
  expect(result).toBeFalsy();
});

test('isHexStringNormalString', () => {
  const address = 'jinrummie.eth';
  const result = isHexString(address);
  expect(result).toBeFalsy();
});

test('toWei', () => {
  const wei = toWei('1');
  expect(wei).toBe('1000000000000000000');
});

test('toWei', () => {
  const wei = toWei('1');
  expect(wei).toBe('1000000000000000000');
});

test('toChecksumAddress', async () => {
  const address = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const expectedResult = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const result = await toChecksumAddress(address);
  expect(result).toBe(expectedResult);
});

test('createSignableEthTransaction', async () => {
  const from = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const transaction = {
    amount: '0.01',
    asset: {
      address: null,
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH'
    },
    to: 'jinrummie.eth',
    from,
    gasPrice: '12345',
    gasLimit: '21000',
  };
  const result = await createSignableTransaction(transaction);
  expect(result.to).toBe('jinrummie.eth');
  expect(result.data).toBe('0x');
});

test('createSignableTransactionTokenTransfer', async () => {
  const from = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const contractAddress = '0xE41d2489571d322189246DaFA5ebDe1F4699F498';
  const transaction = {
    amount: '0.01',
    asset: {
      address: contractAddress,
      decimals: 18,
      name: '0x Protocol Token',
      symbol: 'ZRX'
    },
    to: 'jinrummie.eth',
    from,
    gasPrice: '12345',
    gasLimit: '21000',
  };
  const result = await createSignableTransaction(transaction);
  const expectedData = "0xa9059cbb0000000000000000000000001492004547ff0efd778cc2c14e794b26b4701105000000000000000000000000000000000000000000000000002386f26fc10000";
  expect(result.to).toBe(contractAddress);
  expect(result.data).toBe(expectedData);
});

test('getTransferTokenTransaction', async () => {
  const from = '0x1492004547ff0efd778cc2c14e794b26b4701105';
  const contractAddress = '0xE41d2489571d322189246DaFA5ebDe1F4699F498';
  const transaction = {
    amount: '0.01',
    asset: {
      address: contractAddress,
      decimals: 18,
      name: '0x Protocol Token',
      symbol: 'ZRX'
    },
    to: 'jinrummie.eth',
    from,
    gasPrice: '12345',
    gasLimit: '21000',
  };
  const result = await getTransferTokenTransaction(transaction);
  const expectedData = "0xa9059cbb0000000000000000000000001492004547ff0efd778cc2c14e794b26b4701105000000000000000000000000000000000000000000000000002386f26fc10000";
  expect(result.from).toBe(from);
  expect(result.to).toBe(contractAddress);
  expect(result.data).toBe(expectedData);
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
  expect(result).not.toBe('');
});

test('estimateGas', async () => {
  const result = await estimateGas(estimateGasData);
  expect(result).toBe(37170);
});

/*
test('estimateGasSendingNftV1', async () => {
  const estimateGasDataNft = {
    from: "0x1492004547FF0eFd778CC2c14E794B26B4701105",
    to: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
    data: "0x23b872dd0000000000000000000000001492004547ff0efd778cc2c14e794b26b47011050000000000000000000000001492004547ff0efd778cc2c14e794b26b470110500000000000000000000000000000000000000000000000000000000000aa26d"
  };
  const result = await estimateGas(estimateGasDataNft);
  expect(result).toBe(1);
});
*/

test('estimateGasSendingNftV3', async () => {
  const estimateGasDataNft = {
    from: "0x1492004547FF0eFd778CC2c14E794B26B4701105",
    to: "0x2aea4add166ebf38b63d09a75de1a7b94aa24163",
    data: "0x23b872dd0000000000000000000000001492004547ff0efd778cc2c14e794b26b47011050000000000000000000000001492004547ff0efd778cc2c14e794b26b470110500000000000000000000000000000000000000000000000000000000000003c2"
  };
  const result = await estimateGas(estimateGasDataNft);
  expect(result).toBe(154177);
});

test('estimateGasToEns', async () => {
  const result = await estimateGas(estimateGasDataToEns);
  expect(result).toBe(21000);
});

test('toHex', () => {
  const result = toHex(37170);
  expect(result).toBe('0x9132');
});

test('toHexString', () => {
  const result = toHex('37170');
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

test('estimateGasLimitForTokenTransfer8Decimals', async () => {
  const amount = undefined;
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
	const asset = {
		name: 'Exceed',
		symbol: 'EXC',
		address: '0x1eAe15d9f4FA16f5278D02d2f8bDA8b0dcd31f71',
    balance: {
      amount: "1.97899609544e+21",
    },
		decimals: 8,
	};
  const gasLimit = await estimateGasLimit({
    asset,
    address,
    recipient,
    amount,
  });
  expect(gasLimit).toBe(37695);
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

test('estimateGasLimitForTokenTransferToEns', async () => {
  const amount = '0.01';
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  const recipient = 'jinrummie.eth';
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
