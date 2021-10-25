import React from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Welcome from './containers/Welcome/Welcome';
import SignUp from './containers/SignUp/SignUp';

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
          <Route
            path="/signup"
            exact
            render={() => <SignUp history={props.history} />}
          />
          <Redirect exact from="/" to="login" />
          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
