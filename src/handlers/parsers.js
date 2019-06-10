import { get, pick } from 'lodash';
import {
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToDisplay,
  convertAssetAmountToNativeAmount,
  divide,
  multiply,
  simpleConvertAmountToDisplay,
} from '../helpers/bignumber';
import ethUnits from '../references/ethereum-units.json';
import nativeCurrencies from '../references/native-currencies.json';
import timeUnits from '../references/time-units.json';
import { getTransactionCount } from './web3_ethers';
import { getTimeString } from '../helpers/time';

export const getTxFee = (gasPrice, gasLimit) => {
  const amount = multiply(gasPrice, gasLimit);
  return {
    value: {
      amount,
      display: convertAmountToDisplay(
        amount,
        {
          symbol: 'ETH',
          decimals: 18,
        },
      ),
    },
    native: null,
  };
};

export const defaultGasPriceFormat = (option, timeAmount, valueAmount, valueDisplay, short) => {
  return {
    option,
    estimatedTime: {
      amount: timeAmount,
      display: getTimeString(timeAmount, 'ms', short),
    },
    value: {
      amount: valueAmount,
      display: valueDisplay,
    },
  };
};

/**
 * @desc parse ether gas prices
 * @param {Object} data
 * @param {Object} prices
 * @param {Number} gasLimit
 */
export const parseGasPrices = (data, priceUnit, gasLimit, nativeCurrency, short) => {
  const gasPrices = {
    slow: null,
    average: null,
    fast: null,
  };
  if (!data) {
    gasPrices.fast = defaultGasPriceFormat('fast', '30000','5000000000', '5 Gwei', short);
    gasPrices.average = defaultGasPriceFormat('average', '360000', '2000000000', '2 Gwei', short);
    gasPrices.slow = defaultGasPriceFormat('slow', '1800000','1000000000', '1 Gwei', short);
  } else {
    const fastTimeAmount = multiply(data.fastWait, timeUnits.ms.minute);
    const fastValueAmount = divide(data.fast, 10);
    gasPrices.fast = defaultGasPriceFormat(
      'fast',
      fastTimeAmount,
      multiply(fastValueAmount, ethUnits.gwei),
      `${fastValueAmount} Gwei`,
      short
    );

    const avgTimeAmount = multiply(data.avgWait, timeUnits.ms.minute);
    const avgValueAmount = divide(data.average, 10);
    gasPrices.average = defaultGasPriceFormat(
      'average',
      avgTimeAmount,
      multiply(avgValueAmount, ethUnits.gwei),
      `${avgValueAmount} Gwei`,
      short
    );

    const slowTimeAmount = multiply(data.safeLowWait, timeUnits.ms.minute);
    const slowValueAmount = divide(data.safeLow, 10);
    gasPrices.slow = defaultGasPriceFormat(
      'slow',
      slowTimeAmount,
      multiply(slowValueAmount, ethUnits.gwei),
      `${slowValueAmount} Gwei`,
      short
    );
  }
  return parseGasPricesTxFee(gasPrices, priceUnit, gasLimit, nativeCurrency);
};

export const convertGasPricesToNative = (priceUnit, gasPrices, nativeCurrency) => {
  const nativeGases = { ...gasPrices };
  // TODO if prices is empty, still runs thru the logic below and just sets it to 0
  if (prices) {
    nativeGases.fast.txFee.native = getNativeGasPrice(priceUnit, gasPrices.fast.txFee.value.amount, nativeCurrency);
    nativeGases.average.txFee.native = getNativeGasPrice(priceUnit, gasPrices.average.txFee.value.amount, nativeCurrency);
    nativeGases.slow.txFee.native = getNativeGasPrice(priceUnit, gasPrices.slow.txFee.value.amount, nativeCurrency);
  }
  return nativeGases;
};

export const getNativeGasPrice = (priceUnit, feeAmount, nativeCurrency) => {
  const selected = nativeCurrencies[nativeCurrency];
  const amount = convertAssetAmountToNativeAmount(
    feeAmount,
    { symbol: 'ETH' },
    priceUnit,
    nativeCurrency,
  );
  return {
    selected,
    value: {
      amount,
      display: simpleConvertAmountToDisplay(
        amount,
        nativeCurrency,
        2,
      ),
    },
  };
};

/**
 * @desc parse ether gas prices with updated gas limit
 * @param {Object} data
 * @param {Object} prices
 * @param {Number} gasLimit
 */
export const parseGasPricesTxFee = (gasPrices, priceUnit, gasLimit, nativeCurrency) => {
  gasPrices.fast.txFee = getTxFee(gasPrices.fast.value.amount, gasLimit);
  gasPrices.average.txFee = getTxFee(gasPrices.average.value.amount, gasLimit);
  gasPrices.slow.txFee = getTxFee(gasPrices.slow.value.amount, gasLimit);
  return convertGasPricesToNative(priceUnit, gasPrices, nativeCurrency);
};

/**
 * @desc parse unique tokens from opensea
 * @param  {Object}
 * @return {Array}
 */
export const parseAccountUniqueTokens = data =>
  get(data, 'data.assets', []).map(({ asset_contract, background_color, token_id, ...asset }) => ({
    ...pick(asset, [
      'animation_url',
      'current_price',
      'description',
      'external_link',
      'image_original_url',
      'image_preview_url',
      'image_thumbnail_url',
      'image_url',
      'name',
      'permalink',
      'traits',
    ]),
    asset_contract: pick(asset_contract, [
      'address',
      'description',
      'external_link',
      'featured_image_url',
      'hidden',
      'image_url',
      'name',
      'nft_version',
      'schema_name',
      'short_description',
      'symbol',
      'total_supply',
      'wiki_link',
    ]),
    background: background_color ? `#${background_color}` : null,
    id: token_id,
    isNft: true,
    isSendable: (asset_contract.nft_version === "1.0"
                 || asset_contract.nft_version === "3.0"),
    lastPrice: (
      asset.last_sale
      ? Number(convertAmountFromBigNumber(asset.last_sale.total_price))
      : null
    ),
    uniqueId: `${get(asset_contract, 'address')}_${token_id}`,
  }));

/**
 * @desc parse transactions from native prices
 * @param  {Object} [txDetails=null]
 * @param  {Object} [nativeCurrency='']
 * @return {String}
 */
export const parseNewTransaction = async (
  txDetails = null,
  nativeCurrency = '',
) => {
  let totalGas =
    txDetails.gasLimit && txDetails.gasPrice
      ? multiply(txDetails.gasLimit, txDetails.gasPrice)
      : null;
  let txFee = totalGas
    ? {
        amount: totalGas,
        display: convertAmountToDisplay(totalGas, {
          symbol: 'ETH',
          decimals: 18,
        }),
      }
    : null;

  let value = null;
  if (txDetails.amount) {
    const amount = convertAmountToBigNumber(txDetails.amount);
    value = {
      amount,
      display: convertAmountToDisplay(amount, txDetails.asset),
    };
  }
  const nonce =
    txDetails.nonce ||
    (txDetails.from ? await getTransactionCount(txDetails.from) : '');

  let tx = {
    dappName: txDetails.dappName,
    hash: txDetails.hash,
    timestamp: null,
    from: txDetails.from,
    to: txDetails.to,
    error: false,
    native: {},
    nonce,
    value,
    txFee,
    pending: txDetails.hash ? true : false,
    asset: txDetails.asset,
  };

  return tx;
};
