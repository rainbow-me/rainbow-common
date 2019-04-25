import { connect } from 'react-redux';
import { compose, withProps } from 'recompact';
import { sendableUniqueTokensSelector, sortAssetsByNativeAmountSelector } from './assetSelectors';

const mapStateToProps = ({
  assets: {
    assets,
    fetchingAssets,
    fetchingUniqueTokens,
    uniqueTokens,
  },
  settings: { nativeCurrency },
  prices: { prices },
}) => ({
  assets,
  fetchingAssets,
  fetchingUniqueTokens,
  nativeCurrency,
  prices,
  uniqueTokens,
});

const sendableUniqueTokens = (state) => sendableUniqueTokensSelector(state);

const sortAssets = (state) => sortAssetsByNativeAmountSelector(state);

export default Component => compose(
  connect(mapStateToProps),
  withProps(sortAssets),
  withProps(sendableUniqueTokens),
)(Component);
