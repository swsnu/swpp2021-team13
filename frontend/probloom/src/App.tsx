import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

import './App.css';
import Profile from './containers/Profile/Profile';
import ProblemSetSearch from './containers/ProblemSet/ProblemSetSearch/ProblemSetSearch';
import ProblemSetDetail from './containers/ProblemSet/ProblemSetDetail/ProblemSetDetail';
import { NotFound } from './components/NotFound/NotFound';

function App(props: { history: History }) {
  return (
    <div className="App">
      <ConnectedRouter history={props.history}>
        <Switch>
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
