// import ReduxReqs from 'D:/GitHub/redux-reqs/lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import axios from 'axios';
import isObject from 'lodash/isObject';
import { message } from 'antd';
// import pathToRegexp from 'path-to-regexp';
import App, { history } from './App';

// const axios = ReduxReqs.axios;

if (process.env.NODE_ENV === 'development') {
  // axios.defaults.baseURL = 'http://10.0.1.195:3000/';
  axios.defaults.baseURL = 'http://localhost:3000/';
} else {
  axios.defaults.baseURL = 'https://api.note.hengkx.com/';
  // axios.defaults.baseURL = 'http://api.note.hengkx.com/';
}
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    if (isObject(response.data)) {
      if (response.data.code === 401) return history.push('/signin');
      return { ...response.data, _time: new Date().getTime() };
    }
    return response.data;
  }
);

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>
    ,
    document.getElementById('app')
  );
};

render(App);

