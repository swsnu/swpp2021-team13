import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import Prob from '../../../components/Prob/Prob';
import { getProblems } from '../../../store/actions';
import { AppDispatch } from '../../../store/store';
import { User } from '../../../store/reducers/userReducer';
import { Problem } from '../../../store/reducers/problemReducer';
import './ProblemSetSearch.css';

export interface ProblemSetSearchProps {
  history: any;
}

export interface StateFromProps {
  user: User;
  problems: Problem[];
}

export interface DispatchFromProps {
  onGetAllProblems: () => void;
}

type Props = ProblemSetSearchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
export interface ProblemSetSearchState {
  searchBar: string;
  search: string;
  term: string;
  creator: string;
  tag: string;
  sort: string;
}

class ProblemSetSearch extends Component<Props, ProblemSetSearchState> {
  state = {
    searchBar: '',
    search: '',
    term: 'title+content',
    creator: 'open',
    tag: 'all',
    sort: 'date',
  };

  componentDidMount() {
    this.props.onGetAllProblems();
  }

  onClickCreateButton() {
    this.props.history.push('/problem/create/');
  }

  onClickSearchButton() {
    const search = this.state.searchBar;
    this.setState({ search: search });
  }

  onClickProbHandler = (problem) => {
    this.props.history.push('/problem/' + problem.id + '/');
  };

  render() {
    const problems = this.props.problems
      .filter((prob) => {
        let check = new RegExp(this.state.search);
        switch (this.state.term) {
          case 'title':
            return check.test(prob.title);
          case 'content':
            return check.test(prob.content);
          case 'title+content':
          default:
            return check.test(prob.title) || check.test(prob.content);
        }
      })
      .filter((prob) => prob.userID === this.props.user.id || prob.is_open)
      .filter(
        (prob) =>
          prob.userID === this.props.user.id || this.state.creator !== 'own'
      )
      .filter((prob) => this.state.tag === 'all' || prob.tag === this.state.tag)
      .sort((a, b) => {
        switch (this.state.sort) {
          case 'solved':
            return b.solved_num - a.solved_num;
          case 'recommended':
            return b.recommended_num - a.recommended_num;
          case 'date':
          default:
            return b.date.localeCompare(a.date);
        }
      })
      .map((prob) => {
        return (
          <Prob
            key={prob.id}
            title={prob.title}
            date={prob.date}
            creator={prob.creator}
            solved={prob.solved}
            recommended={prob.recommended}
            clickProb={() => this.onClickProbHandler(prob)}
          />
        );
      });

    return (
      <div className="ProblemSetSearch">
        <button id="create" onClick={() => this.onClickCreateButton()}>
          Create
        </button>
        <div>
          <input
            id="search_bar"
            type="text"
            value={this.state.searchBar}
            onChange={(event) => {
              this.setState({ searchBar: event.target.value });
            }}
          />
          <button id="search" onClick={() => this.onClickSearchButton()}>
            Search
          </button>
          <select
            id="term"
            value={this.state.term}
            onChange={(event) => {
              this.setState({ term: event.target.value });
            }}
          >
            <option value="title+content">title+content</option>
            <option value="title">title</option>
            <option value="content">content</option>
          </select>
          <select
            id="creator"
            value={this.state.creator}
            onChange={(event) => {
              this.setState({ creator: event.target.value });
            }}
          >
            <option value="open">open</option>
            <option value="own">own</option>
          </select>
          <select
            id="tag"
            value={this.state.tag}
            onChange={(event) => {
              this.setState({ tag: event.target.value });
            }}
          >
            <option value="all">all</option>
            <option value="math">math</option>
            <option value="english">english</option>
            <option value="history">history</option>
            <option value="science">science</option>
          </select>
          <select
            id="sort"
            value={this.state.sort}
            onChange={(event) => {
              this.setState({ sort: event.target.value });
            }}
          >
            <option value="date">date</option>
            <option value="solved">solved</option>
            <option value="recommended">recommended</option>
          </select>
        </div>
        {problems}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user.selectedUser,
    problems: state.problem.problems,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onGetAllProblems: () => dispatch(getProblems()),
});

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetSearch);
