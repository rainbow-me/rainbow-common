import { filter, map } from 'lodash';
import { getUniswapLiquidityInfo } from '../handlers/uniswap';
import { parseError } from '../handlers/parsers';
import {
  getUniswap,
  saveUniswap,
  removeUniswap,
} from '../handlers/commonStorage';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const UNISWAP_LOAD_REQUEST =
  'uniswap/UNISWAP_LOAD_REQUEST';
const UNISWAP_LOAD_SUCCESS =
  'uniswap/UNISWAP_LOAD_SUCCESS';
const UNISWAP_LOAD_FAILURE =
  'uniswap/UNISWAP_LOAD_FAILURE';

const UNISWAP_UPDATE_REQUEST =
  'uniswap/UNISWAP_UPDATE_REQUEST';
const UNISWAP_UPDATE_SUCCESS =
  'uniswap/UNISWAP_UPDATE_SUCCESS';
const UNISWAP_UPDATE_FAILURE =
  'uniswap/UNISWAP_UPDATE_FAILURE';

const UNISWAP_CLEAR_STATE = 'uniswap/UNISWAP_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
export const uniswapLoadState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  dispatch({ type: UNISWAP_LOAD_REQUEST });
  getUniswap(accountAddress, network)
    .then(uniswap => {
      dispatch({
        type: UNISWAP_LOAD_SUCCESS,
        payload: uniswap,
      });
    }).catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: UNISWAP_LOAD_FAILURE });
    });
};

export const uniswapClearState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  removeUniswap(accountAddress, network);
  dispatch({ type: UNISWAP_CLEAR_STATE });
};

export const uniswapUpdateState = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { accountAddress, network } = getState().settings;
  const { assets } = getState().assets;
  const liquidityTokens = filter(assets, (asset) => asset.symbol === 'UNI-V1');
  const exchangeContracts = map(liquidityTokens, x => x.address);
  dispatch({ type: UNISWAP_UPDATE_REQUEST });
  getUniswapLiquidityInfo(accountAddress, exchangeContracts)
    .then(uniswap => {
      saveUniswap(accountAddress, uniswap, network);
      dispatch({
        type: UNISWAP_UPDATE_SUCCESS,
        payload: uniswap,
      });
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: UNISWAP_UPDATE_FAILURE });
      reject(error);
    });
});

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_UNISWAP_STATE = {
  fetchingUniswap: false,
  loadingUniswap: false,
  uniswap: {},
};

export default (state = INITIAL_UNISWAP_STATE, action) => {
  switch (action.type) {
    case UNISWAP_LOAD_REQUEST:
      return {
        ...state,
        loadingUniswap: true,
      };
    case UNISWAP_LOAD_SUCCESS:
      return {
        ...state,
        uniswap: action.payload,
        loadingUniswap: false,
      };
    case UNISWAP_LOAD_FAILURE:
      return {
        ...state,
        loadingUniswap: false,
      };
    case UNISWAP_UPDATE_REQUEST:
      return {
        ...state,
        fetchingUniswap: true,
      };
    case UNISWAP_UPDATE_SUCCESS:
      return {
        ...state,
        uniswap: action.payload,
        fetchingUniswap: false,
      };
    case UNISWAP_UPDATE_FAILURE:
      return {
        ...state,
        fetchingUniswap: false,
      };
    case UNISWAP_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_UNISWAP_STATE,
      };
    default:
      return state;
  }
};
