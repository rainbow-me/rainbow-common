import '@babel/polyfill';
import {
  apiGetTransactionData
} from '../api'

test('apiGetTransactionData', async () => {
  const address = '0x1492004547FF0eFd778CC2c14E794B26B4701105';
  let result = await apiGetTransactionData(address, 1);
  expect(result.data.total).toBe(1);
});
