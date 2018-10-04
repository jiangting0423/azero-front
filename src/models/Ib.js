import { message } from 'antd';
import queryString from 'query-string';
import {
  queryIbSyncData,
  queryIbSyncProgressData,
  queryIbConfigSyncSymbols,
  queryIbStartData,
  queryIbStopData,
} from '../services/ib';

export default {
  namespace: 'Ib',

  state: {
    loading: false,
    syncData: {},
    progressData: {},
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      console.info(1111, payload);
      const payloadTrue = Object.keys(payload).length >= 1 ? payload : '0';
      const response = yield call(queryIbSyncData, payloadTrue);
      const responseTest = yield call(queryIbConfigSyncSymbols, payload);
      console.info('queryIbConfigSyncSymbols', responseTest);
      if (response && response.success) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: { syncData: data },
        });
      }
    },

    * fetchProgress({ payload }, { call, put }) {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const response = yield call(queryIbSyncProgressData, payload);
      // console.info('1111ibProgress', response);
      if (response && response.success) {
        const { data: { data } } = response;
        yield put({
          type: 'save',
          payload: { progressData: data },
        });
      }
      const { pathname } = location;
      // just send requests every second
      if (pathname.includes('ib')) {
        // according to the response to judge whether it can send the requests or not
        if (response && response.data && response.data.data) {
          // const { data: { data: { currentProgress } } } = response;
          // if (parseInt(currentProgress, 10) !== 1) {
          yield delay(1000);
          yield put({ type: 'fetchProgress' });
          // }
        }
      }
    },

    * fetchStart(_, { call, put }) {
      const response = yield call(queryIbStartData);
      if (response && response.success) {
        yield put({ type: 'fetch' });
        yield put({ type: 'fetchProgress' });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '当前数据同步成功开启' : '当前数据同步已经开启，不需要再开启';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
      }
    },

    * fetchStop(_, { call, put }) {
      const response = yield call(queryIbStopData);
      if (response && response.success) {
        yield put({ type: 'fetch' });
        const { data: { status } } = response;
        const statusDetail = parseInt(status, 10) === 0 ? '正在同步，已经关闭' : '已经关闭';
        message.success(statusDetail);
      } else {
        message.warning('请求失败,请联系系统管理员');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
      };
    },
  },

  // 监听事件
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (pathname.includes('/ib')) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
          dispatch({
            type: 'fetchProgress',
            payload: query,
          });
        }
      });
    },
  },
};
