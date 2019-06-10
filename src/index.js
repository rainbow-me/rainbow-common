import "@babel/polyfill";
import supportedNativeCurrencies from './references/native-currencies.json';
import lang, { resources, supportedLanguages } from './languages';

import {
  withSendComponentWithData
} from './components/SendComponentWithData';
import {
  withUniqueTokens
} from './hoc';
import {
  accountClearState,
  accountLoadState,
  assets,
  send,
  sendClearFields,
  sendMaxBalance,
  sendModalInit,
  sendToggleConfirmationView,
  sendTransaction,
  sendUpdateAssetAmount,
  sendUpdateGasPrice,
  sendUpdateNativeAmount,
  sendUpdateRecipient,
  sendUpdateSelected,
  settings,
  settingsChangeLanguage,
  settingsChangeNativeCurrency,
  settingsInitializeState,
  settingsUpdateAccountAddress,
  settingsUpdateNetwork,
  transactions,
  transactionsRefreshState,
  transactionsUpdateHasPendingTransaction,
  transactionsAddNewTransaction,
  uniqueTokensRefreshState,
} from './reducers';
import {
  isValidAddress,
  isValidEmail,
  isValidSeedPhrase,
} from './helpers/validators';
import {
  calcTxFee,
  capitalize,
  ellipseText,
  getDataString,
  getDerivationPathComponents,
  getEth,
  removeHexPrefix,
  transactionData,
} from './helpers/utilities';
import {
  add,
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToDisplay,
  convertAssetAmountFromBigNumber,
  convertAssetAmountToBigNumber,
  convertAssetAmountToDisplay,
  convertAssetAmountToDisplaySpecific,
  convertAssetAmountToNativeValue,
  convertAmountToUnformattedDisplay,
  convertHexToString,
  convertNumberToString,
  convertStringToHex,
  convertStringToNumber,
  divide,
  formatInputDecimals,
  fromWei,
  greaterThan,
  greaterThanOrEqual,
  handleSignificantDecimals,
  hasHighMarketValue,
  hasLowMarketValue,
  multiply,
  simpleConvertAmountToDisplay,
  smallerThan,
  subtract,
} from './helpers/bignumber';
import { getCountdown, getLocalTimeDate, sortList } from './helpers';
import {
  apiGetGasPrices,
  estimateGas,
  estimateGasLimit,
  getTransactionCount,
  isHexString,
  parseGasPrices,
  toChecksumAddress,
  toHex,
  web3Provider,
} from './handlers';
import * as commonStorage from './handlers/commonStorage';
export {
  accountClearState,
  accountLoadState,
  add,
  apiGetGasPrices,
  assets,
  calcTxFee,
  capitalize,
  commonStorage,
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToDisplay,
  convertAssetAmountFromBigNumber,
  convertAssetAmountToBigNumber,
  convertAssetAmountToDisplay,
  convertAssetAmountToDisplaySpecific,
  convertAssetAmountToNativeValue,
  convertAmountToUnformattedDisplay,
  convertHexToString,
  convertNumberToString,
  convertStringToHex,
  convertStringToNumber,
  divide,
  ellipseText,
  estimateGas,
  estimateGasLimit,
  formatInputDecimals,
  fromWei,
  getCountdown,
  getDataString,
  getDerivationPathComponents,
  getEth,
  getLocalTimeDate,
  getTransactionCount,
  greaterThan,
  greaterThanOrEqual,
  handleSignificantDecimals,
  hasHighMarketValue,
  hasLowMarketValue,
  isHexString,
  isValidAddress,
  isValidEmail,
  isValidSeedPhrase,
  lang,
  multiply,
  parseGasPrices,
  removeHexPrefix,
  resources,
  send,
  sendClearFields,
  sendMaxBalance,
  sendModalInit,
  sendToggleConfirmationView,
  sendTransaction,
  sendUpdateAssetAmount,
  sendUpdateGasPrice,
  sendUpdateNativeAmount,
  sendUpdateRecipient,
  sendUpdateSelected,
  settings,
  settingsChangeLanguage,
  settingsChangeNativeCurrency,
  settingsInitializeState,
  settingsUpdateAccountAddress,
  settingsUpdateNetwork,
  simpleConvertAmountToDisplay,
  smallerThan,
  sortList,
  subtract,
  supportedLanguages,
  supportedNativeCurrencies,
  toChecksumAddress,
  toHex,
  transactionData,
  transactions,
  transactionsRefreshState,
  transactionsUpdateHasPendingTransaction,
  transactionsAddNewTransaction,
  uniqueTokensRefreshState,
  web3Provider,
  withSendComponentWithData,
  withUniqueTokens,
};
