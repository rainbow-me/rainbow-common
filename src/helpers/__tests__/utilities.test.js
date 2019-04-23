import {
  getChainIdFromNetwork,
  getNetworkFromChainId,
} from '../utilities'

const testCases = [
  { network: 'mainnet', chain: 1 },
  { network: 'ropsten', chain: 3 },
  { network: 'rinkeby', chain: 4 },
  { network: 'kovan', chain: 42 },
];

test('getChainIdFromNetwork', () => {
  testCases.forEach(testCase =>
    expect(getChainIdFromNetwork(testCase.network)).toBe(testCase.chain),
  );
});

test('getChainIdFromUnknownNetwork', () => {
  testCases.forEach(testCase =>
    expect(getChainIdFromNetwork('BLAH')).toBe(1),
  );
});

test('getNetworkFromChainId', () => {
  testCases.forEach(testCase =>
    expect(getNetworkFromChainId(testCase.chain)).toBe(testCase.network),
  );
});

test('getNetworkFromUnknownChainId', () => {
  expect(getNetworkFromChainId(1234)).toBe('mainnet');
});
