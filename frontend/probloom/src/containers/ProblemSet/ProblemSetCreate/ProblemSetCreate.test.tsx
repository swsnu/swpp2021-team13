import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import {
  fireEvent,
  getAllByRole,
  render,
  screen,
} from '@testing-library/react';

import { history } from '../../../store/store';

import * as problemActions from '../../../store/actions/problemSetActions';

import { User, UserState } from '../../../store/reducers/userReducer';
import {
  Solver,
  ProblemSetWithProblemsInterface,
  ProblemType,
} from '../../../store/reducers/problemReducerInterface';
import { ProblemSetState } from '../../../store/reducers/problemReducer';
import { Comment, CommentState } from '../../../store/reducers/commentReducer';

import ProblemSetCreate from './ProblemSetCreate';

// 1. User state for test
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

const TestUserState: UserState = {
  users: [testUser1, testUser2],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

// 2. ProblemSet state for test
const testProblemSet: ProblemSetWithProblemsInterface = {
  id: 0,
  title: 'title1',
  createdTime: '2021-01-01',
  modifiedTime: '2021-01-01',
  isOpen: false,
  tag: [['math']],
  difficulty: 1,
  content: 'content1',
  userID: 1,
  username: 'user1',
  solvedNum: 1,
  recommendedNum: 1,
  problems: [0],
};

const testSolver: Solver = {
  userID: 1,
  username: 'user1',
  problemID: 1,
  problemtitle: 'title1',
  result: true,
};

const testSelectedProblem: ProblemType = {
  id: 0,
  problemType: 'multiple-choice',
  problemSetID: 0,
  problemNumber: 0,
  creatorID: 0,
  createdTime: '2021-01-01',
  content: 'test-content',
  solverIDs: [0],
  choices: ['choice1', 'choice2', 'choice3', 'choice4'],
  solution: [0],
};

const TestProblemSetState: ProblemSetState = {
  problemSets: [testProblemSet],
  solvers: [testSolver],
  isRecommender: false,
  selectedProblemSet: testProblemSet,
  selectedProblem: testSelectedProblem,
};

// 3. Comment state for test
const testComment: Comment = {
  id: 1,
  createdTime: '2020-10-10',
  content: 'test-comment',
  userID: 1,
  username: 'test-user1',
  problemSetID: 1,
};

const TestCommentState: CommentState = {
  comments: [testComment],
  selectedComment: null,
};

// 4. mock store for test
const mockStore = getMockStore(
  TestUserState,
  TestProblemSetState,
  TestCommentState
);

describe('<ProblemSetCreate />', () => {
  let problemSetCreate;
  let spyCreateProblemSet;

  beforeEach(() => {
    problemSetCreate = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetCreate} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyCreateProblemSet = jest
      .spyOn(problemActions, 'createProblemSet')
      .mockImplementation((data) => {
        return (data) => {};
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetCreate', () => {
    const component = mount(problemSetCreate);
    const wrapper = component.find('.ProblemSetCreate');
    expect(wrapper.length).toBe(1);
  });

  it('simulate buttons', async () => {
    const spyHistoryBack = jest
      .spyOn(history, 'goBack')
      .mockImplementation(() => {});
    const component = mount(problemSetCreate);
    const backButton = component
      .find('.ProblemSetCreate #problemsetcreate-back')
      .at(0);
    const addButton = component.find('#problemsetcreate-add').at(0);
    const submitButton = component
      .find('.ProblemSetCreate #problemsetcreate-submit')
      .at(0);
    expect(backButton.length).toBe(1);
    expect(addButton.length).toBe(1);
    expect(submitButton.length).toBe(1);
    backButton.simulate('click');
    expect(spyHistoryBack).toHaveBeenCalledTimes(1);
  });

  it('simulate create inputs', async () => {
    const component = mount(problemSetCreate);

    // -------------------------- problem set --------------------------
    const inputTitle = component.find('.ProblemSetCreate #input-title').at(0);
    inputTitle.simulate('change', { target: { value: 'test-title1' } });
    const inputTitle2 = component.find('.ProblemSetCreate #input-title').at(1);
    inputTitle2.simulate('change', { target: { value: 'test-title2' } });

    const inputContent = component
      .find('.ProblemSetCreate #input-content-text')
      .at(0);
    inputContent.simulate('change', { target: { value: 'test-content' } });
    const inputContent2 = component
      .find('.ProblemSetCreate #input-content-text')
      .at(2);
    inputContent2.simulate('change', { target: { value: 'test-content2' } });

    const wrapper_inputScope = component.find({ label: 'Scope' });
    const inputScope = wrapper_inputScope.find('DropdownItem');
    inputScope.at(1).simulate('click');

    const wrapper_inputTag1 = component.find({ label: 'Tag1' });
    const inputTag1 = wrapper_inputTag1.find('DropdownItem');
    inputTag1.at(1).simulate('click');

    const wrapper_inputTag2 = component.find({ label: 'Tag2' });
    const inputTag2 = wrapper_inputTag2.find('DropdownItem');
    inputTag2.at(1).simulate('click');

    const wrapper_inputDifficulty = component.find({ label: 'Difficulty' });
    const inputDifficulty = wrapper_inputDifficulty.find('DropdownItem');
    inputDifficulty.at(1).simulate('click');

    // -------------------------- problems --------------------------
    // -------------------------- ADD 1st problem --------------------------
    const addButton = component.find('#problemsetcreate-add').at(0);
    addButton.simulate('click');
    addButton.simulate('click');
    addButton.simulate('click');
    addButton.simulate('click');
    let removeButton = component.find('#problemsetcreate-remove').at(2);
    removeButton.simulate('click');
    removeButton = component.find('#problemsetcreate-remove').at(0);
    removeButton.simulate('click');
    removeButton = component.find('#problemsetcreate-remove').at(0);
    removeButton.simulate('click');
    removeButton.simulate('click');
    addButton.simulate('click');

    const wrapper_inputType0 = component.find({ label: 'Type' }).at(0);
    // const wrapper_inputType1 = component.find({ label: 'Type' }).at(1);
    const inputType0 = wrapper_inputType0.find('DropdownItem');
    // const inputType1 = wrapper_inputType1.find('DropdownItem');
    // console.log('@@@@@@@inputType0.length', inputType0.length);
    // console.log('@@@@@@@inputType1.length', inputType1.length);
    // console.log('@@@@@@@inputType0', inputType0.at(0), inputType0.at(1));
    // console.log('@@@@@@@inputType1', inputType1.at(0), inputType1.at(1));
    inputType0.at(1).simulate('click');
    inputType0.at(0).simulate('click');
    // inputType1.at(1).simulate('click');
    // inputType1.at(0).simulate('click');

    // const wrapper_inputType3 = component.find({ label: 'Type' });
    // const inputType3 = wrapper_inputType3.find('DropdownItem');
    // inputType3.simulate('click');

    const wrapper_statement = component
      .find('.ProblemSetCreate #problemset-problem-content-input')
      .at(3);
    wrapper_statement.simulate('change', { target: { value: 'test-value' } });

    const wrapper_choice1 = component.find(
      '.ProblemSetCreate #problem-choice1-input'
    );
    wrapper_choice1.at(0).simulate('change', { target: { value: '' } });
    wrapper_choice1.at(1).simulate('change', { target: { value: '' } });

    const wrapper_choice2 = component.find(
      '.ProblemSetCreate #problem-choice2-input'
    );
    wrapper_choice2.at(0).simulate('change', { target: { value: '' } });
    wrapper_choice2.at(1).simulate('change', { target: { value: '' } });

    const wrapper_choice3 = component.find(
      '.ProblemSetCreate #problem-choice3-input'
    );
    wrapper_choice3.at(0).simulate('change', { target: { value: '' } });
    wrapper_choice3.at(1).simulate('change', { target: { value: '' } });

    const wrapper_choice4 = component.find(
      '.ProblemSetCreate #problem-choice4-input'
    );
    wrapper_choice4.at(0).simulate('change', { target: { value: '' } });
    wrapper_choice4.at(1).simulate('change', { target: { value: '' } });

    const wrapper_solution_1 = component.find(
      '.ProblemSetCreate #problem-solution1-input'
    );
    wrapper_solution_1.at(0).simulate('change', { target: { value: '1' } });
    // wrapper_solution_1.at(0).simulate('change', { target: { value: '' } });
    // wrapper_solution_1.at(1).simulate('change', { target: { value: '1' } });

    const wrapper_solution_2 = component.find(
      '.ProblemSetCreate #problem-solution2-input'
    );
    wrapper_solution_2.at(0).simulate('change', { target: { value: '2' } });
    // wrapper_solution_2.at(0).simulate('change', { target: { value: '' } });
    // wrapper_solution_2.at(1).simulate('change', { target: { value: '2' } });

    const wrapper_solution_3 = component.find(
      '.ProblemSetCreate #problem-solution3-input'
    );
    wrapper_solution_3.at(0).simulate('change', { target: { value: '3' } });
    // wrapper_solution_3.at(0).simulate('change', { target: { value: '' } });
    // wrapper_solution_3.at(1).simulate('change', { target: { value: '3' } });

    const wrapper_solution_4 = component.find(
      '.ProblemSetCreate #problem-solution4-input'
    );
    wrapper_solution_4.at(0).simulate('change', { target: { value: '4' } });
    // wrapper_solution_4.at(0).simulate('change', { target: { value: '' } });
    // wrapper_solution_4.at(1).simulate('change', { target: { value: '4' } });

    // -------------------------- ADD 2nd problem --------------------------
    addButton.simulate('click');
    const wrapper_inputType2 = component.find({ label: 'Type' }).at(2);
    // const wrapper_inputType3 = component.find({ label: 'Type' }).at(3);
    // console.log('@@@@@@@wrapper_inputType2.length', wrapper_inputType2.length);

    const inputType2 = wrapper_inputType2.find('DropdownItem');
    // const inputType3 = wrapper_inputType3.find('DropdownItem');
    inputType2.at(1).simulate('click');
    inputType2.at(0).simulate('click');
    // inputType3.at(1).simulate('click');
    // inputType3.at(0).simulate('click');

    let file2 = new File(['file contents'], 'foo.png', { type: 'image/png' });
    const wrapper_content_image2 = component.find(
      '.ProblemSetCreate #problemset-problem-content-input-file-button'
    );
    wrapper_content_image2.at(3).simulate('change', {
      target: { files: [file2] },
    });
    const pauseFor2 = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));
    await pauseFor2(100);

    const wrapper_statement2 = component
      .find('.ProblemSetCreate #problemset-problem-content-input')
      .at(7);
    wrapper_statement2.simulate('change', { target: { value: 'test-value' } });

    const wrapper_choice12 = component.find(
      '.ProblemSetCreate #problem-choice1-input'
    );
    wrapper_choice12.at(2).simulate('change', { target: { value: '' } });
    wrapper_choice12.at(3).simulate('change', { target: { value: '' } });

    const wrapper_choice22 = component.find(
      '.ProblemSetCreate #problem-choice2-input'
    );
    wrapper_choice22.at(2).simulate('change', { target: { value: '' } });
    wrapper_choice22.at(3).simulate('change', { target: { value: '' } });

    const wrapper_choice32 = component.find(
      '.ProblemSetCreate #problem-choice3-input'
    );
    wrapper_choice32.at(2).simulate('change', { target: { value: '' } });
    wrapper_choice32.at(3).simulate('change', { target: { value: '' } });

    const wrapper_choice42 = component.find(
      '.ProblemSetCreate #problem-choice4-input'
    );
    wrapper_choice42.at(2).simulate('change', { target: { value: '' } });
    wrapper_choice42.at(3).simulate('change', { target: { value: '' } });

    const wrapper_solution_12 = component.find(
      '.ProblemSetCreate #problem-solution1-input'
    );
    wrapper_solution_12.at(2).simulate('change', { target: { value: '1' } });
    wrapper_solution_12.at(3).simulate('change', { target: { value: '1' } });
    wrapper_solution_12.at(3).simulate('change', { target: { value: '' } });

    const wrapper_solution_22 = component.find(
      '.ProblemSetCreate #problem-solution2-input'
    );
    wrapper_solution_22.at(2).simulate('change', { target: { value: '2' } });
    wrapper_solution_22.at(3).simulate('change', { target: { value: '2' } });
    wrapper_solution_22.at(3).simulate('change', { target: { value: '' } });

    const wrapper_solution_32 = component.find(
      '.ProblemSetCreate #problem-solution3-input'
    );
    wrapper_solution_32.at(2).simulate('change', { target: { value: '3' } });
    wrapper_solution_32.at(3).simulate('change', { target: { value: '3' } });
    wrapper_solution_32.at(3).simulate('change', { target: { value: '' } });

    const wrapper_solution_42 = component.find(
      '.ProblemSetCreate #problem-solution4-input'
    );
    wrapper_solution_42.at(2).simulate('change', { target: { value: '4' } });
    wrapper_solution_42.at(3).simulate('change', { target: { value: '4' } });
    wrapper_solution_42.at(3).simulate('change', { target: { value: '' } });

    // -------------------------- ADD 3rd problem --------------------------
    // console.log('***********************************************');

    addButton.simulate('click');
    const wrapper_inputType5 = component.find({ label: 'Type' }).at(5);
    const inputType5 = wrapper_inputType5.find('DropdownItem');
    inputType5.at(0).simulate('click');
    inputType5.at(0).simulate('click');
    inputType5.at(1).simulate('click');
    inputType5.at(1).simulate('click');

    const wrapper_statement3 = component.find(
      '.ProblemSetCreate #problemset-problem-content-input'
    );
    wrapper_statement3
      .at(11)
      .simulate('change', { target: { value: 'test-value' } });

    const wrapper_subjective_input1 = component.find(
      '.ProblemSetCreate #subjective-problem-answer-input'
    );
    wrapper_subjective_input1
      .at(1)
      .simulate('change', { target: { value: 'test-answer' } });

    const wrapper_change_type = component.find({ label: 'Type' }).at(5);
    const inputType9 = wrapper_change_type.find('DropdownItem');
    inputType9.at(0).simulate('click');
    inputType9.at(1).simulate('click');

    // const currnet_content = component.find(
    //   '.ProblemSetCreate .ProblemContent #qwerty'
    // );
    // console.log('@@@@@@currnet_content', currnet_content);
    // console.log('@@@@@@currnet_content.length', currnet_content.length);

    // const currnet_content2 = component.find(
    //   '.ProblemSetCreate .ProblemContent #qwerty2'
    // );
    // console.log('@@@@@@currnet_content2', currnet_content2);
    // console.log('@@@@@@currnet_content2.length', currnet_content2.length);

    // const currnet_content3 = component.find(
    //   '.ProblemSetCreate .ProblemContent #asdfg'
    // );
    // console.log('@@@@@@currnet_content3', currnet_content3);
    // console.log('@@@@@@currnet_content3.length', currnet_content3.length);
    // let ret = currnet_content3.find('.item');
    // console.log('@@@@@@ret', ret);
    // console.log('@@@@@@ret.length', ret.length);
    // ret.at(0).simulate('click');

    let file3 = new File(['file contents'], 'foo.png', { type: 'image/png' });

    const wrapper_content_image3 = component.find(
      '.ProblemSetCreate #problemset-problem-content-input-file-button'
    );

    wrapper_content_image3.at(5).simulate('change', {
      target: { files: '' },
    });
    wrapper_content_image3.at(5).simulate('change', {
      target: { files: [file3] },
    });

    const pauseFor3 = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));
    await pauseFor3(100);

    const submitButton = component.find('#problemsetcreate-submit').at(0);
    submitButton.simulate('click');
  });

  it('should render signin', () => {
    const UserStateTest: UserState = {
      users: [testUser1, testUser2],
      selectedUser: null,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };
    const mockStore = getMockStore(UserStateTest);
    const component = mount(
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetCreate} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    history.push('/');
  });
});
