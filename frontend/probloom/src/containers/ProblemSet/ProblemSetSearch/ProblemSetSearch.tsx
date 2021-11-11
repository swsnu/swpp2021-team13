import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getAllProblemSets } from '../../../store/actions';
import ProblemSetSearchResult from '../../../components/ProblemSetSearchResult/ProblemSetSearchResult';
import { AppDispatch, RootState } from '../../../store/store';
import './ProblemSetSearch.css';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Header,
  Icon,
  Input,
  Segment,
  Table,
} from 'semantic-ui-react';

export interface ProblemSetSearchProps {
  history: any;
}

export interface ProblemSetSearchState {
  searchBar: string;
  search: string;
  term: string;
  creator: string;
  tag: string;
  sort: string;
}

const searchRangeOptions = [
  { text: 'Title + Content', value: 'title+content' },
  { text: 'Title', value: 'title' },
  { text: 'Content', value: 'content' },
];

const creatorOptions = [
  { text: 'Open Problems', value: 'open' },
  { text: 'Your Problems', value: 'own' },
];

const tagOptions = [
  { text: 'all', value: 'all' },
  { text: 'philosophy', value: 'tag-philosophy' },
  { text: 'psychology', value: 'tag-psychology' },
  { text: 'statistics', value: 'tag-statistics' },
  { text: 'economics', value: 'tag-economics' },
  { text: 'mathematics', value: 'tag-mathematics' },
  { text: 'physics', value: 'tag-physics' },
  { text: 'chemistry', value: 'tag-chemistry' },
  { text: 'biology', value: 'tag-biology' },
  { text: 'engineering', value: 'tag-engineering' },
  { text: 'history', value: 'tag-history' },
];

const sortOptions = [
  { text: 'Date', value: 'date' },
  { text: 'Solved', value: 'solved' },
  { text: 'Recommended', value: 'recommended' },
];

class ProblemSetSearch extends Component<
  PropsFromRedux & RouteComponentProps,
  ProblemSetSearchState
> {
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
    this.props.history.push('/problem/' + problem.id + '/detail/');
  };

  render() {
    if (this.props.user === null) {
      return <Redirect to="/signin" />;
    }

    let problems = this.props.problemSets
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
      .filter((prob) => prob.userID === this.props.user?.id || prob.is_open)
      .filter(
        (prob) =>
          prob.userID === this.props.user?.id || this.state.creator !== 'own'
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
            return b.created_time.localeCompare(a.created_time);
        }
      })
      .map((prob) => {
        return (
          <ProblemSetSearchResult
            key={prob.id}
            title={prob.title}
            date={prob.created_time}
            creator={prob.username}
            solved={prob.solved_num}
            recommended={prob.recommended_num}
            clickProb={() => this.onClickProbHandler(prob)}
          />
        );
      });

    let problemsWrapper: JSX.Element;
    if (problems.length === 0) {
      problemsWrapper = (
        <Segment placeholder>
          <Header icon>
            <Icon name="search" />
            No Results
          </Header>
        </Segment>
      );
    } else {
      problemsWrapper = (
        <Table basic="very" padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              <Table.HeaderCell>Author</Table.HeaderCell>
              <Table.HeaderCell>Solved People</Table.HeaderCell>
              <Table.HeaderCell>Recommendations</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{problems}</Table.Body>
        </Table>
      );
    }

    return (
      <div className="ProblemSetSearch">
        <Container>
          <Header as="h1">
            Problems
            <Button
              primary
              floated="right"
              id="create"
              onClick={() => this.onClickCreateButton()}
            >
              Create
            </Button>
          </Header>
          <Form style={{ margin: '2rem 1rem 0' }}>
            <Form.Group>
              <Form.Field width={12}>
                <Input
                  label={
                    <Button
                      secondary
                      type="submit"
                      id="search"
                      onClick={() => this.onClickSearchButton()}
                    >
                      Search
                    </Button>
                  }
                  labelPosition="right"
                  placeholder="Search Problems..."
                  value={this.state.searchBar}
                  onChange={(event) =>
                    this.setState({ searchBar: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Dropdown
                width={4}
                item
                options={searchRangeOptions}
                label="Range"
                defaultValue="title+content"
                onChange={(_, { value }) => {
                  this.setState({ term: value as string });
                }}
              />

              <Form.Dropdown
                width={4}
                item
                options={creatorOptions}
                label="Creator"
                defaultValue="open"
                onChange={(_, { value }) => {
                  this.setState({ creator: value as string });
                }}
              />

              <Form.Dropdown
                width={4}
                item
                options={tagOptions}
                label="Tag"
                defaultValue="all"
                onChange={(_, { value }) =>
                  this.setState({ tag: value as string })
                }
              />

              <Form.Dropdown
                width={4}
                item
                options={sortOptions}
                label="Sort By"
                defaultValue="date"
                onChange={(_, { value }) =>
                  this.setState({ sort: value as string })
                }
              />
            </Form.Group>
          </Form>
          {problemsWrapper}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.selectedUser,
    problemSets: state.problemset.problemSets,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onGetAllProblems: () => dispatch(getAllProblemSets()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ProblemSetSearch));
