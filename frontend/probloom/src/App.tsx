import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

import './App.css';
import Welcome from './containers/Welcome/Welcome';
import SignUp from './containers/SignUp/SignUp';
import Profile from './containers/Profile/Profile';
import ProblemSetSearch from './containers/ProblemSet/ProblemSetSearch/ProblemSetSearch';
import ProblemSetDetail from './containers/ProblemSet/ProblemSetDetail/ProblemSetDetail';
import NotFound from './components/NotFound/NotFound';

function App(props: { history: History }) {
  return (
    <div className="App">
      <ConnectedRouter history={props.history}>
        <Switch>
          <Route
            path="/login"
            exact
            render={() => <Welcome history={props.history} logo="ProbLoom" />}
          />
          <Route
            path="/signup"
            exact
            render={() => <SignUp history={props.history} />}
          />
          <Redirect exact from="/" to="login" />
          <Route path="/user/:id/:active" exact component={Profile} />
          <Redirect from="/user/:id" to="/user/:id/summary" exact />
          <Route path="/problem/search" exact component={ProblemSetSearch} />
          <Route
            path="/problem/:id/detail"
            exact
            component={ProblemSetDetail}
          />
          <Route component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
