import { ethers } from 'ethers';
import { endsWith, startsWith, replace } from 'lodash';
import { REACT_APP_INFURA_PROJECT_ID } from 'react-native-dotenv';
import { isValidAddress } from '../helpers/validators';
import { getDataString, removeHexPrefix } from '../helpers/utilities';
import {
  convertStringToNumber,
  convertNumberToString,
  convertAmountToBigNumber,
  convertAssetAmountFromBigNumber,
  convertHexToString,
  convertStringToHex,
  convertAmountToAssetAmount,
} from '../helpers/bignumber';
import ethUnits from '../references/ethereum-units.json';
import smartContractMethods from '../references/smartcontract-methods.json';

const infura_url = `https://network.infura.io/v3/${REACT_APP_INFURA_PROJECT_ID}`;

/**
 * @desc web3 http instance
 */
export let web3Provider = new ethers.providers.JsonRpcProvider(replace(infura_url, 'network', 'mainnet'));

/**
 * @desc set a different web3 provider
 * @param {String} network
 */
export const web3SetHttpProvider = network => {
  // TODO check network is valid network
  web3Provider = new ethers.providers.JsonRpcProvider(replace(infura_url, 'network', network));
};

/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String} checksum address
 */
export const toChecksumAddress = async (address) => {
  try {
    return await ethers.utils.getAddress(address);
  } catch (error) {
    return null;
  }
};

/**
 * @desc convert to hex representation
 * @param  {String|Number} value
 * @return {String} hex value
 */
export const toHex = value => ethers.utils.hexlify(ethers.utils.bigNumberify(value));

/**
 * @desc estimate gas limit
 * @param  {String} address
 * @return {Number} gas limit
 */
export const estimateGas = async (estimateGasData) => { 
  console.log('estimateGas data', estimateGasData);
  const gasLimit = await web3Provider.estimateGas(estimateGasData);
  return gasLimit.toNumber();
};

/**
 * @desc get gas price
 * @return {String} gas price
 */
export const getGasPrice = async () => { 
  const gasPrice = await web3Provider.getGasPrice();
  return gasPrice.toString();
};

/**
 * @desc convert from ether to wei
 * @param  {String} value in ether
 * @return {String} value in wei
 */
export const toWei = ether => {
  const result = ethers.utils.parseEther(ether);
  return result.toString();
};

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Provider.getTransactionCount(address, 'pending');

/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async (transaction) => {
  const from =
    startsWith(transaction.from, '0x')
      ? transaction.from
      : `0x${transaction.from}`;
  const to =
    endsWith(transaction.to, '.eth')
      ? transaction.to
      : startsWith(transaction.to, '0x')
        ? transaction.to
        : `0x${transaction.to}`;
  const value = transaction.amount ? toWei(transaction.amount) : '0x00';
  const data = transaction.data ? transaction.data : '0x';
  const _gasPrice = transaction.gasPrice || (await getGasPrice());
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data };
  console.log('estimate gas from txdetails', estimateGasData);
  const _gasLimit =
    transaction.gasLimit || (await estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  console.log('value!', value);
  const tx = {
    data,
    from,
    gas: toHex(_gasLimit),
    gasLimit: toHex(_gasLimit),
    gasPrice: toHex(_gasPrice),
    nonce: toHex(nonce),
    to,
    value: toHex(value),
  };
  return tx;
};

/**
 * @desc get transfer token transaction
 * @param  {Object}  transaction { asset, from, to, amount, gasPrice }
 * @return {Object}
 */
export const getTransferTokenTransaction = async (transaction) => {
  const transferMethodHash = smartContractMethods.token_transfer.hash;
  const value = convertStringToHex(
    convertAmountToAssetAmount(transaction.amount, transaction.asset.decimals),
  );
  let recipient = transaction.to;
  if (endsWith(transaction.to, '.eth')) {
    recipient = await web3Provider.resolveName(transaction.to);
  }
  recipient = removeHexPrefix(recipient);
  const dataString = getDataString(transferMethodHash, [recipient, value]);
  return {
    from: transaction.from,
    to: transaction.asset.address,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit,
  };
};

/**
 * @desc transform into signable transaction
 * @param {Object} transaction { asset, from, to, amount, gasPrice }
 * @return {Promise}
 */
export const createSignableTransaction = transaction =>
  new Promise((resolve, reject) => {
    if (transaction.asset.symbol !== 'ETH') {
      getTransferTokenTransaction(transaction)
      .then(result => {
        getTxDetails(result)
          .then(txDetails => resolve(txDetails))
          .catch(error => reject(error));
      }).catch(error => reject(error));
    } else {
      getTxDetails(transaction)
        .then(txDetails => resolve(txDetails))
        .catch(error => reject(error));
    }
  });

/**
 * @desc estimate gas limit
 * @param {Object} [{selected, address, recipient, amount, gasPrice}]
 * @return {String}
 */
export const estimateGasLimit = async ({
  asset,
  address,
  recipient,
  amount,
}) => {
  let gasLimit = ethUnits.basic_tx;
  let data = '0x';
  let _amount =
    amount && Number(amount)
      ? convertAmountToBigNumber(amount)
      : asset.balance.amount * 0.1;
  let _recipient = recipient;
  if (endsWith(recipient, '.eth')) {
    _recipient = await web3Provider.resolveName(recipient);
  }
  _recipient =
    _recipient && await isValidAddress(_recipient)
      ? _recipient
      : '0x737e583620f4ac1842d4e354789ca0c5e0651fbb';
  let estimateGasData = { to: _recipient, data };
  if (asset.symbol !== 'ETH') {
    const transferMethodHash = smartContractMethods.token_transfer.hash;
    console.log('asset', asset);
    let value = convertAssetAmountFromBigNumber(_amount, asset.decimals);
    console.log('_amount', _amount);
    console.log('value', value);
    value = convertStringToHex(value);
    console.log('value', value);
    // TODO
    data = getDataString(transferMethodHash, [
      removeHexPrefix(_recipient),
      value,
    ]);
    estimateGasData = { from: address, to: asset.address, data, value: '0x0' };
    // TODO duplicate logic
    console.log('estimate gas limit', estimateGasData);
    gasLimit = await estimateGas(estimateGasData);
  } else {
    let value = convertAssetAmountFromBigNumber(_amount, asset.decimals);
    estimateGasData = { from: address, to: recipient, data, value };
    gasLimit = await estimateGas(estimateGasData);
  }
  return gasLimit;
};
