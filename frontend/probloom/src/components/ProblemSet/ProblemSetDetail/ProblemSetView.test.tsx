import React from 'react';
import { shallow } from 'enzyme';
import ProblemSetView from './ProblemSetView';

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
      <ProblemSetView isCreator={true} isSolver={true} />
    );
    const wrapper = component.find('.ProblemSetView');
    expect(wrapper.length).toBe(1);
  });
});
