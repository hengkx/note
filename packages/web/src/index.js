// import ReduxReqs from 'D:/GitHub/redux-reqs/lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import axios from 'axios';
import { browserHistory } from 'react-router';
import isObject from 'lodash/isObject';
import { message } from 'antd';
// import pathToRegexp from 'path-to-regexp';
import App from './App';

// const axios = ReduxReqs.axios;

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://10.0.1.195:3000/'; // 'http://localhost:3000/';
} else {
  axios.defaults.baseURL = 'http://115.29.168.166:14003/';
}
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    if (isObject(response.data)) {
      if (response.data.Status === 500) message.error(response.data.Message);
      if (response.data.code === 401) return browserHistory.push('/signin');

      return { ...response.data, _time: new Date().getTime() };
    }

    return response.data;
  },
  (error) => {
    // if (error.response.status === 401) return browserHistory.push('/login');
    return Promise.reject(error.response);
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

