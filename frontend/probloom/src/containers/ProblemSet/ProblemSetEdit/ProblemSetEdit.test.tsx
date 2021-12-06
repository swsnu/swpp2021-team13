import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import * as problemActions from '../../../store/actions/problemSetActions';
import * as interfaces from '../../../store/reducers/problemReducerInterface';
import { ProblemSetState } from '../../../store/reducers/problemReducer';
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

const UserStateTest: UserState = {
  users: [testUser1],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const problemSet: interfaces.ProblemSetWithProblemsInterface = {
  id: 0,
  title: 'title',
  createdTime: '',
  modifiedTime: '',
  isOpen: true,
  tag: [],
  difficulty: 0,
  content: 'content',
  userID: 1,
  username: 'username',
  solvedNum: 0,
  recommendedNum: 0,
  problems: [1, 2],
};

const multipleChoiceProblem : interfaces.MultipleChoiceProblemInterface = {
  id: 1,
  problemType: 'multiple-choice',
  problemSetID: 1,
  problemNumber: 1,
  creatorID: 1,
  createdTime: '',
  content: 'mcp-content',
  solverIDs: [],
  choices: ['choice1', 'choice2'],
  solution: [1],
}

const subjectiveProblem : interfaces.SubjectiveProblemInterface = {
  id: 2,
  problemType: 'subjective',
  problemSetID: 1,
  problemNumber: 2,
  creatorID: 1,
  createdTime: '',
  content: 'sp-content',
  solverIDs: [],
  solutions: ['solution1', 'solution2'],
}

const ProblemSetStateTest1: ProblemSetState = {
  problemSets: [],
  solvers: [],
  isRecommender: false,
  selectedProblemSet: problemSet,
  selectedProblem: multipleChoiceProblem,
};

const ProblemSetStateTest2: ProblemSetState = {
  problemSets: [problemSet],
  solvers: [],
  isRecommender: false,
  selectedProblemSet: problemSet,
  selectedProblem: subjectiveProblem,
};

const comment1: Comment = {
  id: 1,
  createdTime: '2020-10-10',
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

describe('<ProblemSetEdit />', () => {
  let problemEdit1, problemEdit2;
  let spyCreateProblem, spyGetProblem, spyUpdateProblem, spyDeleteProblem;

  beforeEach(() => {
    problemEdit1 = (
      <Provider store={mockStore1}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetEdit} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    problemEdit2 = (
      <Provider store={mockStore2}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetEdit} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    spyCreateProblem = jest
      .spyOn(problemActions, 'createProblem')
      .mockImplementation(() => {
        return (data) => {};
      });
    spyGetProblem = jest
      .spyOn(problemActions, 'getProblem')
      .mockImplementation(() => {
        return (data) => {};
      });
    spyUpdateProblem = jest
      .spyOn(problemActions, 'updateProblem')
      .mockImplementation(() => {
        return (data) => {};
      });
    spyDeleteProblem = jest
      .spyOn(problemActions, 'deleteProblem')
      .mockImplementation(() => {
        return (data) => {};
      })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetEdit', () => {
    const component = mount(problemEdit1);
    const wrapper = component.find('.ProblemSetEdit');
    expect(wrapper.length).toBe(1);
    const saveButton = component
      .find('.SaveButton');
    expect(saveButton.length).toBe(0);
  });

  it('create problem', () => {
    const component1 = mount(problemEdit1);
    const createMCPButton = component1
      .find('.NewMCPButton').at(1);
    createMCPButton.simulate('click');
    expect(spyCreateProblem).toHaveBeenCalledTimes(1);

    const component2 = mount(problemEdit2);
    const createSPButton = component2
      .find('.NewSPButton').at(1);
    createSPButton.simulate('click');
    expect(spyCreateProblem).toHaveBeenCalledTimes(2);
  });

  it('click problem number button', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(1);
    problemNumberButton.simulate('click');
    expect(spyGetProblem).toHaveBeenCalled();
  })

  it('change mcp textarea', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(1);
    problemNumberButton.simulate('click');
    const t = component.find('.MutipleChoiceProblemForm');
    console.log(component.debug())
    const problemContent = component
      .find('.MCPTextarea').at(0);
    problemContent.simulate('change', { target: { value: 'modified' } });
  })

  it('add choice', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent = component
      .find('.AddChoiceButton').at(0);
    problemContent.simulate('click');
  })

  it('change choice input', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent = component
      .find('.Choice1 .ChoiceInput input').at(0);
    problemContent.simulate('change', { target: { value: 'modified' } });
  })

  it('change choice checkbox', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent1 = component
      .find('.Choice1 .ChoiceCheckbox').at(0);
    problemContent1.simulate('change');
    problemContent1.simulate('change');
    const problemContent2 = component
      .find('.Choice2 .ChoiceCheckbox').at(0);
    problemContent2.simulate('change');
  })

  it('change sp textarea', () => {
    const component = mount(problemEdit2);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent = component
      .find('.SPTextarea').at(0);
    problemContent.simulate('change', { target: { value: 'modified' } });
  })

  it('add solution', () => {
    const component = mount(problemEdit2);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent = component
      .find('.AddSolutionButton').at(0);
    problemContent.simulate('click');
  })

  it('change solution input', () => {
    const component = mount(problemEdit2);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const problemContent = component
      .find('.Solution1 .SolutionInput input').at(0);
    problemContent.simulate('change', { target: { value: 'modified' } });
  })

  it('save modified mcp', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const saveButton = component
      .find('.SaveButton').at(0);
    saveButton.simulate('click');
    expect(spyUpdateProblem).toHaveBeenCalled()
  })

  it('save modified sp', () => {
    const component = mount(problemEdit2);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const saveButton = component
      .find('.SaveButton').at(0);
    saveButton.simulate('click');
    expect(spyUpdateProblem).toHaveBeenCalled()
  })

  it('delete problem', () => {
    const component = mount(problemEdit1);
    const problemNumberButton = component
      .find('.P0Button').at(0);
    problemNumberButton.simulate('click');
    const saveButton = component
      .find('.DeleteButton').at(0);
    saveButton.simulate('click');
    expect(spyDeleteProblem).toHaveBeenCalled()
  })
});
