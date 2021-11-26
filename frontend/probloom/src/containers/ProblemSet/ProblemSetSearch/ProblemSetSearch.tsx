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
  { key: 'title+content', text: 'Title + Content', value: 'title+content' },
  { key: 'title', text: 'Title', value: 'title' },
  { key: 'content', text: 'Content', value: 'content' },
];

const creatorOptions = [
  { key: 'open', text: 'Open Problems', value: 'open' },
  { key: 'own', text: 'Your Problems', value: 'own' },
];

export const tagOptions1 = [
  { key: 'tag-all', text: 'all', value: 'tag-all' },
  { key: 'tag-humanities', text: 'humanities', value: 'tag-humanities' },
  {
    key: 'tag-social-science',
    text: 'social-science',
    value: 'tag-social-science',
  },
  { key: 'tag-science', text: 'science', value: 'tag-science' },
  { key: 'tag-engineering', text: 'engineering', value: 'tag-engineering' },
  { key: 'tag-etc', text: 'etc', value: 'tag-etc' },
];

export const tagOptions2 = {
  'tag-all': [{ key: 'tag-all', text: 'all', value: 'tag-all' }],
  'tag-humanities': [
    { key: 'tag-philosophy', text: 'philosophy', value: 'tag-philosophy' },
    { key: 'tag-history', text: 'history', value: 'tag-history' },
    { key: 'tag-linguistics', text: 'linguistics', value: 'tag-linguistics' },
    { key: 'tag-aesthetics', text: 'aesthetics', value: 'tag-aesthetics' },
    {
      key: 'tag-religious-studies',
      text: 'religious-studies',
      value: 'tag-religious-studies',
    },
  ],
  'tag-social-science': [
    { key: 'tag-psychology', text: 'psychology', value: 'tag-psychology' },
    { key: 'tag-economics', text: 'economics', value: 'tag-economics' },
    {
      key: 'tag-political-science',
      text: 'political-science',
      value: 'tag-political-science',
    },
    { key: 'tag-sociology', text: 'sociology', value: 'tag-sociology' },
    {
      key: 'tag-anthropology',
      text: 'anthropology',
      value: 'tag-anthropology',
    },
    { key: 'tag-geography', text: 'geography', value: 'tag-geography' },
    {
      key: 'tag-social-welfare',
      text: 'social-welfare',
      value: 'tag-social-welfare',
    },
  ],
  'tag-science': [
    { key: 'tag-statistics', text: 'statistics', value: 'tag-statistics' },
    { key: 'tag-mathematics', text: 'mathematics', value: 'tag-mathematics' },
    { key: 'tag-biology', text: 'biology', value: 'tag-biology' },
    { key: 'tag-physics', text: 'physics', value: 'tag-physics' },
    { key: 'tag-chemistry', text: 'chemistry', value: 'tag-chemistry' },
    { key: 'tag-astronomy', text: 'astronomy', value: 'tag-astronomy' },
  ],
  'tag-engineering': [
    {
      key: 'tag-mechanical-engineering',
      text: 'mechanical-engineering',
      value: 'tag-mechanical-engineering',
    },
    {
      key: 'tag-electrical-and-electronic-engineering',
      text: 'electrical-and-electronic-engineering',
      value: 'tag-electrical-and-electronic-engineering',
    },
    {
      key: 'tag-computer-engineering',
      text: 'computer-engineering',
      value: 'tag-computer-engineering',
    },
    {
      key: 'tag-materials-engineering',
      text: 'materials-engineering',
      value: 'tag-materials-engineering',
    },
    {
      key: 'tag-nuclear-engineering',
      text: 'nuclear-engineering',
      value: 'tag-nuclear-engineering',
    },
    {
      key: 'tag-industrial-engineering',
      text: 'industrial-engineering',
      value: 'tag-industrial-engineering',
    },
    {
      key: 'tag-chemical-engineering',
      text: 'chemical-engineering',
      value: 'tag-chemical-engineering',
    },
    {
      key: 'tag-biological-engineering',
      text: 'biological-engineering',
      value: 'tag-biological-engineering',
    },
  ],
  'tag-etc': [
    {
      key: 'tag-art',
      text: 'art',
      value: 'tag-art',
    },
    {
      key: 'tag-music',
      text: 'music',
      value: 'tag-music',
    },
    {
      key: 'tag-business',
      text: 'business',
      value: 'tag-business',
    },
  ],
};

const sortOptions = [
  { key: 'date', text: 'Date', value: 'date' },
  { key: 'solved', text: 'Solved', value: 'solved' },
  { key: 'recommended', text: 'Recommended', value: 'recommended' },
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
    if (!this.props.user) {
      return <Redirect to="/" />;
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
      .filter((prob) => prob.userID === this.props.user?.id || prob.isOpen)
      .filter(
        (prob) =>
          prob.userID === this.props.user?.id || this.state.creator !== 'own'
      )
//      .filter((prob) => this.state.tag === 'all') //|| prob.tag === this.state.tag)
      .sort((a, b) => {
        switch (this.state.sort) {
          case 'solved':
            return b.solvedNum - a.solvedNum;
          case 'recommended':
            return b.recommendedNum - a.recommendedNum;
          case 'date':
          default:
            return b.createdTime.localeCompare(a.createdTime);
        }
      })
      .map((prob, index) => {
        return (
          <ProblemSetSearchResult
            key={index}
            title={prob.title}
            date={prob.createdTime}
            creator={prob.username}
            solved={0} //{prob.solverIDs.length}
            recommended={prob.recommendedNum}
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
                options={tagOptions2['tag-science']}
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
