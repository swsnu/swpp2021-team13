import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import * as problemActions from '../../../store/actions/problemActions';
import * as commentActions from '../../../store/actions/commentActions';
import {
  Solver,
  ProblemSet,
  ProblemSetState,
  NewProblemSet,
} from '../../../store/reducers/problemReducer';
import { Comment, CommentState } from '../../../store/reducers/commentReducer';
import ProblemSetEdit from './ProblemSetEdit';
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
  id: 0,
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
const problemSet2: ProblemSet = {
  id: 0,
  title: 'title1',
  created_time: '2021-01-01',
  is_open: true,
  tag: 'math',
  difficulty: 1,
  content: 'content1',
  userID: 1,
  username: 'user1',
  solved_num: 1,
  recommended_num: 1,
};

const selectedProblems: NewProblemSet[] = [
  {
    index: 0,
    problem_type: 'type-multiplechoice',
    problem_statement: 'test-statement7',
    choice: ['choice1', 'choice2', 'choice3', 'choice4'],
    solution: 'solution7',
    explanation: 'explanation7',
  },
  {
    index: 1,
    problem_type: 'type-multiplechoice',
    problem_statement: 'test-statement8',
    choice: ['choice1', 'choice2', 'choice3', 'choice4'],
    solution: 'solution8',
    explanation: 'explanation8',
  },
];

const ProblemSetStateTest1: ProblemSetState = {
  problemSets: [problemSet1],
  solvers: [solver1],
  selectedProblemSet: problemSet1,
  selectedProblems: selectedProblems,
};
const ProblemSetStateTest2: ProblemSetState = {
  problemSets: [problemSet1],
  solvers: [solver1],
  selectedProblemSet: problemSet2,
  selectedProblems: selectedProblems,
};

const ProblemSetStateNullTest: ProblemSetState = {
  problemSets: [problemSet1],
  solvers: [solver1],
  selectedProblemSet: null,
  selectedProblems: selectedProblems,
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

const mockStore1 = getMockStore(
  UserStateTest,
  ProblemSetStateTest1,
  CommentStateTest
);
const mockStore2 = getMockStore(
  UserStateTest,
  ProblemSetStateTest2,
  CommentStateTest
);

const mockStoreNull = getMockStore(
  UserStateTest,
  ProblemSetStateNullTest,
  CommentStateTest
);

describe('<ProblemSetEdit />', () => {
  let problemSetEdit, problemSetEdit2, problemSetEditNull;
  let spyGetProblemSet, spyEditProblemSet;

  beforeEach(() => {
    problemSetEdit = (
      <Provider store={mockStore1}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetEdit} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    problemSetEdit2 = (
      <Provider store={mockStore2}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetEdit} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    problemSetEditNull = (
      <Provider store={mockStoreNull}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetEdit} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    spyGetProblemSet = jest
      .spyOn(problemActions, 'getProblemSet')
      .mockImplementation((problemID: number) => {
        return (dispatch) => {};
      });
    spyEditProblemSet = jest
      .spyOn(problemActions, 'editProblemSet')
      .mockImplementation((data) => {
        return (data) => {};
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetEdit', () => {
    const component = mount(problemSetEdit);
    const wrapper = component.find('.ProblemSetEdit');
    expect(wrapper.length).toBe(1);
    expect(spyGetProblemSet).toBeCalledTimes(1);

    const component2 = mount(problemSetEdit2);
    const wrapper2 = component2.find('.ProblemSetEdit');
    expect(wrapper2.length).toBe(1);

    const componentNull = mount(problemSetEditNull);
    const wrapperNull = componentNull.find('.ProblemSetEdit');
    expect(wrapperNull.length).toBe(1);
  });

  it('simulate buttons', async () => {
    const component = mount(problemSetEdit);
    const submitButton = component
      .find('.ProblemSetEdit #problemsetedit-submit')
      .at(0);
    expect(submitButton.length).toBe(1);
  });

  it('simulate edit inputs', async () => {
    const component = mount(problemSetEdit);
    const inputTitle1 = component.find('.ProblemSetEdit #input-title').at(0);
    inputTitle1.simulate('change', { target: { value: 'edit-title1' } });
    const inputTitle2 = component.find('.ProblemSetEdit #input-title').at(1);
    inputTitle2.simulate('change', { target: { value: 'edit-title2' } });

    const inputContent1 = component
      .find('.ProblemSetEdit #input-content')
      .at(0);
    inputContent1.simulate('change', { target: { value: 'edit-content1' } });
    const inputContent2 = component
      .find('.ProblemSetEdit #input-content')
      .at(2);
    inputContent2.simulate('change', { target: { value: 'edit-content1' } });

    const wrapper_inputScope = component.find({ label: 'Scope' });
    const inputScope = wrapper_inputScope.find('DropdownItem');
    inputScope.at(0).simulate('click');
    inputScope.at(1).simulate('click');

    const wrapper_inputTag = component.find({ label: 'Tag' });
    const inputTag = wrapper_inputTag.find('DropdownItem');
    inputTag.at(1).simulate('click');

    const wrapper_inputDifficulty = component.find({ label: 'Difficulty' });
    const inputDifficulty = wrapper_inputDifficulty.find('DropdownItem');
    inputDifficulty.at(1).simulate('click');

    // currentProblemSet
    const wrapper_inputType = component.find({ label: 'Type' });
    const inputType = wrapper_inputType.find('DropdownItem');
    inputType.at(0).simulate('click');

    const wrapper_statement = component
      .find('.ProblemSetEdit #problemset-problem-statement-input')
      .at(0);
    wrapper_statement.simulate('change', { target: { value: '' } });

    const wrapper_choice1 = component
      .find('.ProblemSetEdit #problemset-choice1-input')
      .at(0);
    wrapper_choice1.simulate('change', { target: { value: '' } });

    const wrapper_choice2 = component
      .find('.ProblemSetEdit #problemset-choice2-input')
      .at(0);
    wrapper_choice2.simulate('change', { target: { value: '' } });

    const wrapper_choice3 = component
      .find('.ProblemSetEdit #problemset-choice3-input')
      .at(0);
    wrapper_choice3.simulate('change', { target: { value: '' } });

    const wrapper_choice4 = component
      .find('.ProblemSetEdit #problemset-choice4-input')
      .at(0);
    wrapper_choice4.simulate('change', { target: { value: '' } });

    const wrapper_solution_1 = component
      .find('.ProblemSetEdit #problemset-solution1-input')
      .at(0);
    wrapper_solution_1.simulate('change', { target: { value: '1' } });
    const wrapper_solution_2 = component
      .find('.ProblemSetEdit #problemset-solution2-input')
      .at(0);
    wrapper_solution_2.simulate('change', { target: { value: '2' } });
    const wrapper_solution_3 = component
      .find('.ProblemSetEdit #problemset-solution3-input')
      .at(0);
    wrapper_solution_3.simulate('change', { target: { value: '3' } });
    const wrapper_solution_4 = component
      .find('.ProblemSetEdit #problemset-solution4-input')
      .at(0);
    wrapper_solution_4.simulate('change', { target: { value: '4' } });

    const wrapper_explanation = component
      .find('.ProblemSetEdit #problemset-solution-explanation-input')
      .at(0);
    wrapper_explanation.simulate('change', {
      target: { value: 'test-value1' },
    });

    // 2nd
    const wrapper_inputType2 = component.find({ label: 'Type' }).at(1);
    const inputType2 = wrapper_inputType2.find('DropdownItem');
    inputType2.at(0).simulate('click');

    const wrapper_statement2 = component
      .find('.ProblemSetEdit #problemset-problem-statement-input')
      .at(1);
    wrapper_statement2.simulate('change', { target: { value: '' } });

    const wrapper_choice12 = component
      .find('.ProblemSetEdit #problemset-choice1-input')
      .at(1);
    wrapper_choice12.simulate('change', { target: { value: '' } });

    const wrapper_choice22 = component
      .find('.ProblemSetEdit #problemset-choice2-input')
      .at(1);
    wrapper_choice22.simulate('change', { target: { value: '' } });

    const wrapper_choice32 = component
      .find('.ProblemSetEdit #problemset-choice3-input')
      .at(1);
    wrapper_choice32.simulate('change', { target: { value: '' } });

    const wrapper_choice42 = component
      .find('.ProblemSetEdit #problemset-choice4-input')
      .at(1);
    wrapper_choice42.simulate('change', { target: { value: '' } });

    const wrapper_solution_12 = component
      .find('.ProblemSetEdit #problemset-solution1-input')
      .at(1);
    wrapper_solution_12.simulate('change', { target: { value: '1' } });
    const wrapper_solution_22 = component
      .find('.ProblemSetEdit #problemset-solution2-input')
      .at(1);
    wrapper_solution_22.simulate('change', { target: { value: '2' } });
    const wrapper_solution_32 = component
      .find('.ProblemSetEdit #problemset-solution3-input')
      .at(1);
    wrapper_solution_32.simulate('change', { target: { value: '3' } });
    const wrapper_solution_42 = component
      .find('.ProblemSetEdit #problemset-solution4-input')
      .at(1);
    wrapper_solution_42.simulate('change', { target: { value: '4' } });

    const wrapper_explanation2 = component
      .find('.ProblemSetEdit #problemset-solution-explanation-input')
      .at(1);
    wrapper_explanation2.simulate('change', { target: { value: '' } });

    const submitButton = component.find('#problemsetedit-submit').at(0);
    submitButton.simulate('click');
  });
});
