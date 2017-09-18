import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { NProgress } from 'redux-nprogress';
import './less/main.less';

const { Header, Content } = Layout;


class Main extends React.Component {
  static propTypes = {
    // children: PropTypes.element.isRequired
  };

  render() {
    return (<div>a</div>);
  }
}

export default Main;
