import { stringify } from 'qs';
import request from '../utils/request';

// query td sync data
export async function queryTdSyncData() {
  // return request('/td/getSyncProgress');
  // return request('/api/queryFutuData');
  return request('/td/syncStatus.do');
}

// query td sync progress data
export async function queryTdSyncProgressData() {
  // return request('/td/getSyncProgress');
  return request('/td/getSyncProgress.do');
}

// query td symbols info data
export async function queryTdSymbolsInfoData(params) {
  // return request('/td/getSyncProgress');
  // return request('/td/getSymbolsInfo.do');
  const code = params;
  console.info(4444, code);
  // const newParams = Object.assign({}, { isFuzzy: 1 }, { code });
  return request(`/td/getSymbolsInfo.do?isFuzzy=1&code=${code}`);
}

// query td start data
export async function queryTdStartData() {
  return request('/td/startSync.do');
}

// query td stop data
export async function queryTdStopData() {
  return request('/td/stopSync.do');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function queryFutuData() {
  return request('/api/queryFutuData');
}

export async function queryNotices() {
  return request('/api/notices');
}
