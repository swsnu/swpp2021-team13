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
    const component = shallow(
      <CommentComponent
        isCreator={true}
        onClickEditCommentButton={() => {}}
        onClickDeleteCommentButton={() => {}}
      />
    );
    const wrapper = component.find('.CommentComponent');
    expect(wrapper.length).toBe(1);

    const wrapper_button1 = component.find('.editButton');
    wrapper_button1.at(0).simulate('click');

    const wrapper_button2 = component.find('.deleteButton');
    wrapper_button2.at(0).simulate('click');
  });
});
