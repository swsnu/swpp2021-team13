import { shallow } from 'enzyme';
import Solution from './Solution';

describe('<Solution />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(
      <Solution
        index={1}
        solution='solution'
        editContent={(target, content, index)=>{{}}}
      />);
    const wrapper = component.find('.Solution1');
    expect(wrapper.length).toBe(1);
  });
});
