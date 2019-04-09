import { map } from 'lodash';
import { web3Instance } from './web3';
import exchangeABI from '../references/uniswap-exchange-abi.json';

export const getUniswapLiquidityInfo = async (accountAddress, exchangeContracts) => {
  const results = map(exchangeContracts, async (exchangeAddress) => {
    try {
      const exchange = new web3Instance.eth.Contract(exchangeABI, exchangeAddress);
      const totalSupply = exchange.methods.totalSupply().call();
      const tokenAddress = exchange.methods.tokenAddress().call();
      const tokenBalance = exchange.methods.balanceOf(accountAddress).call();
      const exchangeInfo = await Promise.all([tokenAddress, tokenBalance, totalSupply]);
      return {
        tokenAddress: exchangeInfo[0],
        tokenBalance: exchangeInfo[1],
        totalSupply: exchangeInfo[2],
      };
    } catch (error) {
      console.log('error getting uniswap info', error);
      return {};
    }
  });
  return Promise.all(results);
};
