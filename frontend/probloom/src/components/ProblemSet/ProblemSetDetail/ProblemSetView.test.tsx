import React from 'react';
import { shallow } from 'enzyme';
import ProblemSetView from './ProblemSetView';

describe('<ProblemSetView />', () => {
  it('should render without creator and solver', () => {
    const component = shallow(
      <ProblemSetView
        isCreator={false}
        isSolver={false}
        scope={false}
        isRecommender={true}
        createdTime={'1'}
        modifiedTime={'1'}
      />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
  });

  it('should render with creator and solver', () => {
    const component = shallow(
      <ProblemSetView
        isCreator={true}
        isSolver={true}
        isRecommender={false}
        scope={true}
        createdTime={'1'}
        modifiedTime={'2'}
        onClickSolveProblemButton={() => {}}
        onClickBackButton={() => {}}
        onClickEditProblemButton={() => {}}
        onClickEditProblemSetButton={() => {}}
        onClickDeleteProblemButton={() => {}}
        onClickRecommendationButton={() => {}}
      />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
    const solveButton = component.find('.solveButton');
    solveButton.simulate('click');
    const backButton = component.find('.backButton');
    backButton.simulate('click');
    const editProblemButton = component.find('.editProblemButton');
    editProblemButton.simulate('click');
    const editProblemSetButton = component.find('.editProblemSetButton');
    editProblemSetButton.simulate('click');
    const deleteButton = component.find('.deleteButton');
    deleteButton.simulate('click');
    const recommendationButton = component.find('.recommendationButton');
    recommendationButton.simulate('click');
  });

  it('should render user is not recommender, creator and solver', () => {
    const component = shallow(
      <ProblemSetView
        isCreator={false}
        isSolver={false}
        scope={false}
        isRecommender={false}
        createdTime={'1'}
        modifiedTime={'1'}
      />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
  });
});
