import React, { Component } from 'react';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { withRouter } from 'react-router-dom';
import configureStore from './store/configureStore';
import Main from './containers/Main';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';

const history = createHistory();

const store = configureStore();

export { history };

export default class extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Route exact path="/" component={withRouter(Main)} />
            <Route exact path="/signin" component={withRouter(SignIn)} />
            <Route exact path="/signup" component={withRouter(SignUp)} />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}
