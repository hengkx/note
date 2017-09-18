// import ReduxReqs from 'D:/GitHub/redux-reqs/lib';
import ReduxReqs from 'redux-reqs';
import { beginTask, endTask } from 'redux-nprogress';
import { all } from 'redux-saga/effects';
import { watchSagas as accountSagas } from './account';
// import ReduxReqs from 'redux-reqs';

ReduxReqs.defaults = {
  beforeAction: beginTask(),
  afterAction: endTask(),
};

export default function* rootSaga() {
  yield all([
    ...accountSagas
  ]);
}
