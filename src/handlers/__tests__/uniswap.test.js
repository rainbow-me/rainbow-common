import '@babel/polyfill';
import { getUniswapLiquidityInfo } from '../uniswap'

test('getUniswapLiquidityInfo', async () => {
	const address = "0x1492004547FF0eFd778CC2c14E794B26B4701105";
  const exchangeContracts = ['0xae76c84c9262cdb9abc0c2c8888e62db8e22a0bf'];
  const result = await getUniswapLiquidityInfo(address, exchangeContracts);
  expect(result[0]).toHaveProperty('totalSupply');
  expect(result[0]).toHaveProperty('tokenAddress');
  expect(result[0]).toHaveProperty('tokenBalance');
});
