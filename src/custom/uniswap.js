import { web3Instance } from '../handers/web3';
import exchangeABI from '../references/uniswap-abi.json';

const getExchange = (exchangeAddress) =>
  web3Instance.eth.Contract(exchangeABI, exchangeAddress);

const getToken = (exchangeAddress) => {
  const tokenAddress = getExchange(exchangeAddress).methods.tokenAddress().call();
  return tokenAddress;
};

const getBalance = (accountAddress, exchangeAddress) => {
  const tokenBalance = getExchange(exchangeAddress).methods.balanceOf(accountAddress).call();
  const ethBalance = null; //TODO calculation based on token balance
  return { eth: ethBalance, token: tokenBalance };
}

