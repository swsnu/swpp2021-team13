import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Welcome from './containers/Welcome/Welcome';
import SignUp from './containers/SignUp/SignUp';
import Profile from './containers/Profile/Profile';
import ProblemSetSearch from './containers/ProblemSet/ProblemSetSearch/ProblemSetSearch';
import ProblemSetCreate from './containers/ProblemSet/ProblemSetCreate/ProblemSetCreate';
import ProblemSetDetail from './containers/ProblemSet/ProblemSetDetail/ProblemSetDetail';
import ProblemSetEdit from './containers/ProblemSet/ProblemSetEdit/ProblemSetEdit';
import ProblemSetSolve from './containers/ProblemSet/ProblemSetSolve/ProblemSetSolve';
import ProblemSetExplanationDetail from './containers/ProblemSet/ProblemSetExplanation/ProblemSetExplanationDetail';
import NotFound from './components/NotFound/NotFound';
import AppHeader from './containers/AppHeader/AppHeader';
import Footer from './components/Layout/Footer';

function App(props: { history: History }) {
  return (
    <div className="App" style={{ paddingTop: '4rem' }}>
      <ConnectedRouter history={props.history}>
        <AppHeader />
        <Switch>
          <Route
            path="/signin/"
            exact
            render={() => <Welcome history={props.history} logo="ProbLoom" />}
          />
          <Route
            path="/signup/"
            exact
            render={() => <SignUp history={props.history} />}
          />
          <Redirect exact from="/" to="signin/" />
          <Route path="/user/:id/:active/" exact component={Profile} />
          <Redirect from="/user/:id/" to="/user/:id/summary/" exact />
          <Route path="/problem/search/" exact component={ProblemSetSearch} />
          <Route path="/problem/create/" exact component={ProblemSetCreate} />
          <Route
            path="/problem/:id/detail/"
            exact
            component={ProblemSetDetail}
          />
          <Route path="/problem/:id/solve/" exact component={ProblemSetSolve} />
          <Route path="/problem/:id/edit/" exact component={ProblemSetEdit} />
          <Route
            path="/problem/:id/explanation/"
            exact
            component={ProblemSetExplanationDetail}
          />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </ConnectedRouter>
    </div>
  );
}

export default App;
