import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { withRouter } from 'react-router-dom';
import configureStore from './store/configureStore';
import Main from './components/Main';
import Share from './containers/Share';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Forgot from './containers/Forgot';

const history = createHistory();

const store = configureStore();

export { history };

export default class extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/signin" component={withRouter(SignIn)} />
            <Route exact path="/signup" component={withRouter(SignUp)} />
            <Route exact path="/forgot" component={withRouter(Forgot)} />
            <Route exact path="/share" component={withRouter(Share)} />
            <Route path="/" component={withRouter(Main)} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}
