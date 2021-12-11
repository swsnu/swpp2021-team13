import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as problemActions from '../../../store/actions/problemSetActions';
import {
  ProblemSetWithProblemsInterface,
  MultipleChoiceProblemInterface,
  SubjectiveProblemInterface,
} from '../../../store/reducers/problemReducerInterface';
import { ProblemSetState } from '../../../store/reducers/problemReducer';
import ProblemSetSolve from './ProblemSetSolve';
import { history } from '../../../store/store';
import { User, UserState } from '../../../store/reducers/userReducer';
import axios from 'axios';

const testUser1: User = {
  id: 1,
  username: 'user1',
  email: 'email1@email.emaul',
  logged_in: true,
};

const UserStateTest: UserState = {
  users: [testUser1],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const problemSet1: ProblemSetWithProblemsInterface = {
  id: 1,
  title: 'title1',
  createdTime: '2021-01-01',
  modifiedTime: '2021-01-01',
  isOpen: false,
  tag: [['tag1'], ['tag2']],
  difficulty: 1,
  content: 'content1',
  userID: 1,
  username: 'user1',
  solvedNum: 1,
  recommendedNum: 1,
  problems: [1, 2],
};

const MultipleChoiceProblem: MultipleChoiceProblemInterface = {
  id: 1,
  problemType: 'multiple-choice',
  problemSetID: 1,
  problemNumber: 1,
  creatorID: 1,
  createdTime: '',
  content: '',
  solverIDs: [1],
  choices: ['', '', '', ''],
  solution: [1],
};

const SubjectiveProblem: SubjectiveProblemInterface = {
  id: 2,
  problemType: 'subjective',
  problemSetID: 1,
  problemNumber: 2,
  creatorID: 1,
  createdTime: '',
  content: '',
  solverIDs: [1],
  solutions: [''],
};

const ProblemSetStateTest: ProblemSetState = {
  problemSets: [problemSet1],
  solvers: [],
  selectedSolver: null,
  isRecommender: false,
  selectedProblemSet: problemSet1,
  selectedProblem: MultipleChoiceProblem,
};

const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

describe('<ProblemSetSolve />', () => {
  let problemSetSolve;
  let spyGetProblemSet, spyGetProblem, spyPost;

  beforeEach(() => {
    problemSetSolve = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolve} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGetProblemSet = jest
      .spyOn(problemActions, 'getProblemSet')
      .mockImplementation((problemSetID: number) => {
        return (dispatch) => {};
      });
    spyGetProblem = jest
      .spyOn(problemActions, 'getProblem')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyPost = jest.spyOn(axios, 'post').mockImplementation(async () => ({
      status: 200,
      data: UserStateTest.users[0],
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetSolve', () => {
    const component = mount(problemSetSolve);
    const wrapper = component.find('div.ProblemSetSolve');
    expect(wrapper.length).toBe(1);
    expect(spyGetProblemSet).toBeCalledTimes(1);
    history.push('/');
  });

  it('click back to detail page button', () => {
    const component = mount(problemSetSolve);
    const wrapper_button = component.find('button.backDetailButton');
    wrapper_button.simulate('click');
    history.push('/');
  });

  it('click back to search page button', () => {
    const component = mount(problemSetSolve);
    const wrapper_button = component.find('button.backSearchButton');
    wrapper_button.simulate('click');
    history.push('/');
  });

  it('selectedUser is null', () => {
    const UserStateTest: UserState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };
    const mockStore = getMockStore(UserStateTest);

    problemSetSolve = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolve} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(problemSetSolve);
    history.push('/');
  });

  it('selectedProblem is null', () => {
    const ProblemSetStateTest: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

    problemSetSolve = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolve} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(problemSetSolve);
    history.push('/');
  });

  it('click next, prev, submit button', async () => {
    const component = mount(problemSetSolve);
    // click next button
    const wrapper_button1 = component.find('button.nextButton');
    wrapper_button1.simulate('click');

    // click prev button
    const wrapper_button2 = component.find('button.prevButton');
    wrapper_button2.simulate('click');

    // solve multiple choice problem and click submit button
    const wrapper_choice = component.find('div.checkbox');
    wrapper_choice.at(0).simulate('change', { target: { value: true } });
    // check choice one more for testing 'insert_or_delete' function
    wrapper_choice.at(0).simulate('change', { target: { value: false } });
    wrapper_choice.at(0).simulate('change', { target: { value: true } });
    const wrapper_button3 = component.find('button.submitButton');
    expect(spyGetProblem).toBeCalledTimes(3);
    wrapper_button3.simulate('click');
    expect(spyPost).toBeCalledTimes(1);
  });

  it('solve subjective problem and click result button', async () => {
    const problemSet1: ProblemSetWithProblemsInterface = {
      id: 1,
      title: 'title1',
      createdTime: '2021-01-01',
      modifiedTime: '2021-01-01',
      isOpen: false,
      tag: [['tag1'], ['tag2']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'user1',
      solvedNum: 1,
      recommendedNum: 1,
      problems: [2],
    };

    const ProblemSetStateTest: ProblemSetState = {
      problemSets: [problemSet1],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: problemSet1,
      selectedProblem: SubjectiveProblem,
    };

    const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

    problemSetSolve = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolve} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(problemSetSolve);

    // solve subjective problem and click submit button
    const wrapper_subjective = component.find('textarea');
    const sol = '';
    wrapper_subjective.simulate('change', { target: { value: sol } });
    const wrapper_button = component.find('button.submitButton');
    wrapper_button.simulate('click');
    await Promise.resolve();

    component.update();

    // click result button
    const wrapper_button2 = component.find('button.resultButton');
    wrapper_button2.simulate('click');
    history.push('/');
  });

  it('axios post error detect', async () => {
    spyPost = jest
      .spyOn(axios, 'post')
      .mockImplementation(async () =>
        Promise.reject({ response: { status: 500 } })
      );
    console.error = jest.fn();
    const component = mount(problemSetSolve);

    // solve multiple choice problem and click submit button
    const wrapper_choice = component.find('div.checkbox');
    wrapper_choice.at(0).simulate('change', { target: { value: true } });
    const wrapper_button = component.find('button.submitButton');
    wrapper_button.simulate('click');
  });
});
