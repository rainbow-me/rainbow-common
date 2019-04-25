import axios from 'axios';
import { findIndex, slice } from 'lodash';
import { REACT_APP_TXNS_API } from 'react-native-dotenv';
import {
  parseAccountAssets,
  parseAccountTransactions,
} from './parsers';
import { formatInputDecimals } from '../helpers/bignumber';
import nativeCurrencies from '../references/native-currencies.json';

/**
 * Configuration for cryptocompare api
 * @type axios instance
 */
const cryptocompare = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data/',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * @desc get all assets prices
 * @param  {Array}   [asset=[]]
 * @return {Promise}
 */
export const apiGetPrices = (assets = []) => {
  const assetSymbols = assets.concat('ETH', 'BTC');
  const assetsQuery = JSON.stringify(assetSymbols).replace(/[[\]"]/gi, '');
  const nativeQuery = JSON.stringify(Object.keys(nativeCurrencies)).replace(
    /[[\]"]/gi,
    '',
  );
  return cryptocompare.get(
    `/pricemultifull?fsyms=${assetsQuery}&tsyms=${nativeQuery}`,
  );
};

/**
 * @desc get historical prices
 * @param  {String}  [assetSymbol='']
 * @param  {Number}  [timestamp=Date.now()]
 * @return {Promise}
 */
export const apiGetHistoricalPrices = (
  assetSymbol = '',
  timestamp,
) => {
  const nativeQuery = JSON.stringify(Object.keys(nativeCurrencies)).replace(
    /[[\]"]/gi,
    '',
  );
  return cryptocompare.get(
    `/pricehistorical?fsym=${assetSymbol}&tsyms=${nativeQuery}&ts=${timestamp}`,
  );
};

/**
 * Configuration for transactions API
 * @type axios instance
 */
const transactionsApi = axios.create({
  baseURL: REACT_APP_TXNS_API,
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Configuration for Dapple API
 * @type axios instance
 */
const api = axios.create({
  baseURL: 'https://dapple.rainbow.me',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * @desc get account balances
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetAccountBalances = async (
  address = '',
  network = 'mainnet',
) => {
  try {
    const { data } = await api.get(`/get_balances/${network}/${address}`);
    return parseAccountAssets(data, address);
  } catch (error) {
    console.log('Error getting acct balances from dapple', error);
    throw error;
  }
};

/**
 * @desc get transaction data
 * @param  {String}   [address = '']
 * @return {Promise}
 */
export const apiGetTransactionData = (address, network, limit = 200) => transactionsApi.get(`/transactions?address=${address}&limit=${limit}`);

/**
 * @desc get account transactions
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetAccountTransactions = async (
  assets,
  address = '',
  network = 'mainnet',
  lastTxHash = '',
  page = 1,
) => {
  try {
    let { data } = await apiGetTransactionData(address, network);
    let { transactions, pages } = await parseAccountTransactions(data, assets, address, network);
    if (transactions.length && lastTxHash) {
      const lastTxnHashIndex = findIndex(transactions, (txn) => { return txn.hash === lastTxHash });
      if (lastTxnHashIndex > -1) {
        transactions = slice(transactions, 0, lastTxnHashIndex); 
        pages = page;
      }
    }
    const result = { data: transactions };
    return result;
  } catch (error) {
    console.log('Error getting acct transactions', error);
    throw error;
  }
};

/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */
export const apiGetGasPrices = () => api.get(`/get_eth_gas_prices`);
