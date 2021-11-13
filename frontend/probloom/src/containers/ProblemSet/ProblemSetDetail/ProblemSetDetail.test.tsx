import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as problemActions from '../../../store/actions/problemActions';
import * as commentActions from '../../../store/actions/commentActions';
import {
  Solver,
  ProblemSet,
  ProblemSetState,
} from '../../../store/reducers/problemReducer';
import { Comment, CommentState } from '../../../store/reducers/commentReducer';
import ProblemSetDetail from './ProblemSetDetail';
import { history } from '../../../store/store';
import { User, UserState } from '../../../store/reducers/userReducer';

const testUser1: User = {
  id: 1,
  username: 'user1',
  email: 'email1@email.emaul',
  logged_in: true,
};

const testUser2: User = {
  id: 2,
  username: 'user2',
  email: 'email2@email.emaul',
  logged_in: true,
};

const UserStateTest: UserState = {
  users: [testUser1, testUser2],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const solver1: Solver = {
  userID: 1,
  username: 'user1',
  problemID: 1,
  problemtitle: 'title1',
  result: true,
};

const problemSet1: ProblemSet = {
  id: 1,
  title: 'title1',
  created_time: '2021-01-01',
  is_open: false,
  tag: 'math',
  difficulty: 1,
  content: 'content1',
  userID: 1,
  username: 'user1',
  solved_num: 1,
  recommended_num: 1,
};

const ProblemSetStateTest: ProblemSetState = {
  problemSets: [problemSet1],
  solvers: [solver1],
  selectedProblemSet: problemSet1,
  selectedProblems: [],
};

const comment1: Comment = {
  id: 1,
  date: '2020-10-10',
  content: 'comment',
  userID: 1,
  username: 'user1',
  problemSetID: 1,
};

const CommentStateTest: CommentState = {
  comments: [comment1],
  selectedComment: null,
};

const mockStore = getMockStore(
  UserStateTest,
  ProblemSetStateTest,
  CommentStateTest
);

describe('<ProblemSetDetail />', () => {
  let problemSetDetail;
  let spyGetProblemSet,
    spyGetComments,
    spyGetSolvers,
    spyDeleteProblemSet,
    spyCreateComment,
    spyUpdateComment,
    spyDeleteComment;

  beforeEach(() => {
    problemSetDetail = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetDetail} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGetProblemSet = jest
      .spyOn(problemActions, 'getProblemSet')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyDeleteProblemSet = jest
      .spyOn(problemActions, 'deleteProblemSet')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyGetSolvers = jest
      .spyOn(problemActions, 'getAllSolvers')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyGetComments = jest
      .spyOn(commentActions, 'getCommentsOfProblemSet')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyCreateComment = jest
      .spyOn(commentActions, 'createComment')
      .mockImplementation((comment: any) => {
        return (dispatch) => {};
      });
    spyUpdateComment = jest
      .spyOn(commentActions, 'updateComment')
      .mockImplementation((comment: any) => {
        return (dispatch) => {};
      });
    spyDeleteComment = jest
      .spyOn(commentActions, 'deleteComment')
      .mockImplementation((commentID: number) => {
        return (dispatch) => {};
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetDetail', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('div.ProblemSetDetail');
    expect(wrapper.length).toBe(1);
    expect(spyGetProblemSet).toBeCalledTimes(1);
    expect(spyGetComments).toBeCalledTimes(1);
    expect(spyGetSolvers).toBeCalledTimes(1);
    history.push('/');
  });

  it('should render NotFound', () => {
    const ProblemSetStateTest: ProblemSetState = {
      problemSets: [problemSet1],
      solvers: [solver1],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    const mockStore = getMockStore(
      UserStateTest,
      ProblemSetStateTest,
      CommentStateTest
    );
    const component = mount(
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetDetail} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    history.push('/');
  });

  it('click back button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('button.backButton');
    wrapper.simulate('click');
    expect(window.location.href).toEqual('http://localhost/problem/search/');
    history.push('/');
  });

  it('click edit problem button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('button.editButton');
    wrapper.simulate('click');
    history.push('/');
  });

  it('click delete problem button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('button.deleteButton');
    wrapper.simulate('click');
    expect(spyDeleteProblemSet).toBeCalledTimes(1);
    history.push('/');
  });

  it('click solve problem button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('button.solveButton');
    wrapper.simulate('click');
    history.push('/');
  });

  it('click explanation problem button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('button.explanationButton');
    wrapper.simulate('click');
    history.push('/');
  });

  it('click edit comment button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('div.CommentComponent');
    const wrapper_action = wrapper.find('div.actions');
    const wrapper_edit = wrapper_action.find('CommentAction.editButton');
    wrapper_edit.simulate('click');
    history.push('/');
  });

  it('click delete comment button', () => {
    const component = mount(problemSetDetail);
    const wrapper = component.find('div.CommentComponent');
    const wrapper_action = wrapper.find('div.actions');
    const wrapper_edit = wrapper_action.find('CommentAction.deleteButton');
    wrapper_edit.simulate('click');
    expect(spyDeleteComment).toBeCalledTimes(1);
    expect(spyGetComments).toBeCalledTimes(2);
    history.push('/');
  });

  it('click create comment button', () => {
    const component = mount(problemSetDetail);

    const wrapper_input = component.find('FormTextArea.commentInput');
    const content = 'iluvswpp';
    wrapper_input.simulate('change', { target: { value: content } });

    const wrapper_button = component.find('button.commentConfirmButton');
    wrapper_button.simulate('click');

    expect(spyCreateComment).toBeCalledTimes(1);

    history.push('/');
  });

  it('click update comment button', () => {
    const component = mount(problemSetDetail);

    // click edit comment button first
    const wrapper = component.find('div.CommentComponent');
    const wrapper_action = wrapper.find('div.actions');
    const wrapper_edit = wrapper_action.find('CommentAction.editButton');
    wrapper_edit.simulate('click');

    const wrapper_input = component.find('FormTextArea.commentInput');
    const content = 'iluvswpp';
    wrapper_input.simulate('change', { target: { value: content } });

    const wrapper_button = component.find('button.commentEditConfirmButton');
    wrapper_button.simulate('click');

    expect(spyUpdateComment).toBeCalledTimes(1);

    history.push('/');
  });

  it('should render signin', () => {
    const UserStateTest: UserState = {
      users: [testUser1, testUser2],
      selectedUser: null,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };
    const mockStore = getMockStore(
      UserStateTest,
      ProblemSetStateTest,
      CommentStateTest
    );
    const component = mount(
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetDetail} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    history.push('/');
  });
});
