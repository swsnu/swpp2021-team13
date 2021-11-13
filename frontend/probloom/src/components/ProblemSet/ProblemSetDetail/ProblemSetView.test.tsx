import React from 'react';
import { shallow } from 'enzyme';
import ProblemSetView from './ProblemSetView';
import { Button, Grid, Header } from 'semantic-ui-react';

describe('<ProblemSetView />', () => {
  it('should render without creator and solver', () => {
    const component = shallow(
      <ProblemSetView isCreator={false} isSolver={false} />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
  });

  it('should render with creator and solver', () => {
    const component = shallow(
      <ProblemSetView
        isCreator={true}
        isSolver={true}
        onClickSolveProblemButton={() => {}}
        onClickExplanationButton={() => {}}
        onClickBackButton={() => {}}
        onClickEditProblemButton={() => {}}
        onClickDeleteProblemButton={() => {}}
      />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
    const solveButton = component.find('.solveButton');
    solveButton.simulate('click');
    const explanationButton = component.find('.explanationButton');
    explanationButton.simulate('click');
    const backButton = component.find('.backButton');
    backButton.simulate('click');
    const editButton = component.find('.editButton');
    editButton.simulate('click');
    const deleteButton = component.find('.deleteButton');
    deleteButton.simulate('click');
  });
});
