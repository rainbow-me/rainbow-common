import { connect } from 'react-redux';
import { compose, withProps } from 'recompact';
import { sendableUniqueTokensSelector } from './assetSelectors';

const mapStateToProps = ({
  assets: {
    fetchingUniqueTokens,
    uniqueTokens,
  },
  settings: { nativeCurrency },
  prices: { prices },
}) => ({
  fetchingUniqueTokens,
  nativeCurrency,
  prices,
  uniqueTokens,
});

const sendableUniqueTokens = (state) => sendableUniqueTokensSelector(state);

export default Component => compose(
  connect(mapStateToProps),
  withProps(sendableUniqueTokens),
)(Component);
