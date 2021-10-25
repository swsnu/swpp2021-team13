import React from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Welcome from './containers/Welcome/Welcome';

function App(props) {
  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Switch>
          <Route
            path="/login"
            exact
            render={() => <Welcome history={props.history} logo="ProbLoom" />}
          />
          <Redirect exact from="/" to="login" />
          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
