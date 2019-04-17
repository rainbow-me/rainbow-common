import { isHexString } from '../handlers/web3_ethers';
import { toChecksumAddress, web3Provider } from '../handlers/web3_ethers';

/**
 * @desc validate email
 * @param  {String}  email
 * @return {Boolean}
 */
export const isValidEmail = email =>
  !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

/**
 * @desc validate ethereum address
 * @param  {String} address or ENS
 * @return {Boolean}
 */
export const isValidAddress = async (address) => {
  if (!isHexString(address)) {
    try {
      const resolvedAddress = await web3Provider.resolveName(address);
      return !!resolvedAddress;
    } catch (error) {
      return false;
    }
  }
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
  if (/^(0x)?[0-9a-f]{40}$/.test(address)
    || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
  return address === await toChecksumAddress(address);
};

/**
 * @desc validate seed phrase mnemonic
 * @param  {String} seed phrase mnemonic
 * @return {Boolean}
 */
export const isValidSeedPhrase = (seedPhrase) => {
  const phrases = seedPhrase.split(' ').filter(word => !!word).length;
  return phrases >= 12 && phrases <= 24;
};
