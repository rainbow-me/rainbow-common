import {
  convertAmountFromBigNumber,
  convertAmountToAssetAmount,
  convertAmountToBigNumber,
  handleSignificantDecimals,
  multiply,
  fromWei,
} from '../bignumber'

test('fromWei', () => {
  const testCases = [
    { inputs: [10], expectation: `0.${'0'.repeat(16)}1` },
    { inputs: [10, 18], expectation: `0.${'0'.repeat(16)}1` },
    { inputs: [1000000000000000000], expectation: `1` },
    { inputs: [1000000000000000000, 18], expectation: `1` },
    { inputs: [1000000000000000000, 0], expectation: `1000000000000000000` }
  ]

  testCases.forEach(testCase =>
    expect(fromWei(...testCase.inputs)).toBe(testCase.expectation),
  );
});

test('convertAmountFromBigNumber', () => {
  const testCases = [
    { input: "1.97899609544e+21", expectation: "1978.99609544" },
    { input: "2.0180611e+21", expectation: "2018.0611" },
    { input: "38587486895770700000", expectation: "38.5874868957707" },
    { input: "1000000000000000000", expectation: "1" },
  ]

  testCases.forEach(testCase =>
    expect(convertAmountFromBigNumber(testCase.input)).toBe(testCase.expectation),
  );
});

test('convertAmountToBigNumber', () => {
  const testCases = [
    { input: "1978.99609544", expectation: "1.97899609544e+21" },
    { input: "2018.0611", expectation: "2.0180611e+21" },
    { input: "38.5874868957707", expectation: "38587486895770700000" },
    { input: "1", expectation: "1000000000000000000" },
  ]

  testCases.forEach(testCase =>
    expect(convertAmountToBigNumber(testCase.input)).toBe(testCase.expectation),
  );
});

test('handleSignificantDecimals', () => {
  expect(handleSignificantDecimals("197.899609544", 8, 8)).toBe("197.89960954");
});

test('multiply', () => {
  expect(multiply("1978.99609544", "0.1")).toBe("197.899609544");
});

test('convertAmountToAssetAmount', () => {
  const testCases = [
    { input: ["1978.99609544", 8], expectation: "197899609544" },
    { input: ["0.01", 18], expectation: "10000000000000000" },
  ]

  testCases.forEach(testCase =>
    expect(convertAmountToAssetAmount(...testCase.input).toString()).toBe(testCase.expectation),
  );
});
