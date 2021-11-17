import React from 'react';
import { shallow } from 'enzyme';
import CommentComponent from './CommentComponent';

describe('<CreateComp />', () => {
  it('should render without creator', () => {
    const component = shallow(<CommentComponent isCreator={false} />);
    const wrapper = component.find('.CommentComponent');
    expect(wrapper.length).toBe(1);
  });

  it('should render with creator', () => {
    const component = shallow(<CommentComponent isCreator={true} />);
    const wrapper = component.find('.CommentComponent');
    expect(wrapper.length).toBe(1);
  });
});
