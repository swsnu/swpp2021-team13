import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import './App.css';
import Profile from './containers/Profile/Profile';
import ProfileStatistics from './containers/Profile/ProfileStatistics';
import ProblemSetSearch from './containers/ProblemSet/ProblemSetSearch/ProblemSetSearch';
import ProblemSetDetail from './containers/ProblemSet/ProblemSetDetail/ProblemSetDetail';

function App(props) {
  return (
    <div className="App">
      <ConnectedRouter history={props.history}>
        <Switch>
          <Route path="/user/:id/summary" exact component={Profile} />
          <Route
            path="/user/:id/statistics"
            exact
            component={ProfileStatistics}
          />

          <Route path="/problem/search" exact component={ProblemSetSearch} />
          <Route
            path="/problem/:id/detail"
            exact
            component={ProblemSetDetail}
          />
          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
