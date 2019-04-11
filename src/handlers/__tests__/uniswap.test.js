import '@babel/polyfill';
import { getUniswapLiquidityInfo } from '../uniswap'

const checkExchangeResult = (exchangeResult) => {
  expect(exchangeResult).toHaveProperty('liquidityPoolPercentage');
  expect(exchangeResult).toHaveProperty('tokenAddress');
  expect(exchangeResult).toHaveProperty('balance');
  expect(exchangeResult).toHaveProperty('ethBalance');
  expect(exchangeResult).toHaveProperty('token');
  expect(exchangeResult.token).toHaveProperty('balance');
  expect(exchangeResult.token).toHaveProperty('decimals');
  expect(exchangeResult.token).toHaveProperty('symbol');
};

test('getUniswapLiquidityInfoMultipleExchages', async () => {
	const address = "0x1492004547FF0eFd778CC2c14E794B26B4701105";
  const zrxExchange = '0xae76c84c9262cdb9abc0c2c8888e62db8e22a0bf';
  const daiExchange = '0x09cabec1ead1c0ba254b09efb3ee13841712be14';
  const result = await getUniswapLiquidityInfo(address, [zrxExchange, daiExchange]);
  checkExchangeResult(result[zrxExchange]);
  checkExchangeResult(result[daiExchange]);
});
