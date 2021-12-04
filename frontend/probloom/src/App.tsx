import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Footer from './components/Layout/Footer';
import NotFound from './components/NotFound/NotFound';
import AppHeader from './containers/AppHeader/AppHeader';
import ProblemSetCreate from './containers/ProblemSet/ProblemSetCreate/ProblemSetCreate';
import ProblemSetDetail from './containers/ProblemSet/ProblemSetDetail/ProblemSetDetail';
import ProblemSetEdit from './containers/ProblemSet/ProblemSetEdit/ProblemSetEdit';
import ProblemSetExplanationDetail from './containers/ProblemSet/ProblemSetExplanation/ProblemSetExplanationDetail';
import ProblemSetSearch from './containers/ProblemSet/ProblemSetSearch/ProblemSetSearch';
import ProblemSetSolve from './containers/ProblemSet/ProblemSetSolve/ProblemSetSolve';
import Profile from './containers/Profile/Profile';
import SignUp from './containers/SignUp/SignUp';
import Welcome from './containers/Welcome/Welcome';
import { getCurrentUser } from './store/actions/userActions';
import { AppDispatch, RootState } from './store/store';

export interface AppProps extends PropsFromRedux {
  history: History;
}

class App extends Component<AppProps> {
  render() {
    if (this.props.selectedUser === null) {
      this.props.handleNoUser();
      return null;
    }
    return (
      <div className="App" style={{ paddingTop: '4rem' }}>
        <ConnectedRouter history={this.props.history}>
          <AppHeader />
          <Switch>
            <Route
              path="/signin/"
              exact
              render={() => (
                <Welcome history={this.props.history} logo="ProbLoom" />
              )}
            />
            <Route
              path="/signup/"
              exact
              render={() => <SignUp history={this.props.history} />}
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
            <Route
              path="/problem/:id/solve/"
              exact
              component={ProblemSetSolve}
            />
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
}

const mapStateToProps = (state: RootState) => ({
  selectedUser: state.user.selectedUser,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  handleNoUser: () => dispatch(getCurrentUser()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
