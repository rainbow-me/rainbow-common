import '@babel/polyfill';
import { parseNewTransaction } from '../parsers'

test('parseNewTransaction', async () => {
  const txDetails = {
    asset: undefined,
    from: '0x1492004547FF0eFd778CC2c14E794B26B4701105',
    gasLimit: '21000',
    gasPrice: '21000',
    hash: '0x03e4ea309dc2d642a991d9632',
    nonce: 5,
    to: '0x09cabec1ead1c0ba254b09efb3ee13841712be14',
    value: '5000',
  };
  const result = await parseNewTransaction(txDetails, 'USD');
  expect(result).toBeTruthy();
});
