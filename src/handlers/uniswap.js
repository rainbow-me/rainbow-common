import {
  divide,
  fromWei,
  multiply,
} from '../helpers/bignumber';
import { map, zipObject } from 'lodash';
import { web3Instance } from './web3';
import exchangeABI from '../references/uniswap-exchange-abi.json';
import erc20ABI from '../references/erc20-abi.json';

export const getUniswapLiquidityInfo = async (accountAddress, exchangeContracts) => {
  const promises = map(exchangeContracts, async (exchangeAddress) => {
    try {
      const ethReserveCall = web3Instance.eth.getBalance(exchangeAddress);
      const exchange = new web3Instance.eth.Contract(exchangeABI, exchangeAddress);
      const tokenAddressCall = exchange.methods.tokenAddress().call();
      const balanceCall = exchange.methods.balanceOf(accountAddress).call();
      const totalSupplyCall = exchange.methods.totalSupply().call();

      const exchangeInfo = await Promise.all([ethReserveCall, tokenAddressCall, balanceCall, totalSupplyCall]);
      const ethReserve = exchangeInfo[0];
      const tokenAddress = exchangeInfo[1];
      const balance = exchangeInfo[2];
      const totalSupply = exchangeInfo[3];

      const tokenContract = new web3Instance.eth.Contract(erc20ABI, tokenAddress);
      const tokenReserveCall = tokenContract.methods.balanceOf(exchangeAddress).call();
      const tokenDecimalsCall = tokenContract.methods.decimals().call();
      const tokenInfo = await Promise.all([tokenReserveCall, tokenDecimalsCall]);
      let symbol = '';
      try {
        symbol = await tokenContract.methods.symbol().call().catch();
      } catch (error) {
        console.log('error getting symbol', error);
      }
      const reserve = tokenInfo[0];
      const decimals = tokenInfo[1];

      const ethBalance = fromWei(divide(multiply(ethReserve, balance), totalSupply));
      const tokenBalance = fromWei(divide(multiply(reserve, balance), totalSupply), decimals);
      return {
        tokenAddress,
        balance,
        ethBalance,
        token: {
          balance: tokenBalance,
          decimals,
          symbol,
        },
        totalSupply,
      };
    } catch (error) {
      console.log('error getting uniswap info', error);
      return {};
    }
  });
  const results = await Promise.all(promises);
  return zipObject(exchangeContracts, results);
};
