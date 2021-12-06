import { shallow } from 'enzyme';
import Choice from './Choice';

describe('<Choice />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(
      <Choice
        index={1}
        choice='choice'
        isSolution={true}
        editContent={(
          target: string,
          content?: any,
          index?: any
          )=>{{}}}/>);
    const wrapper = component.find('.Choice1');
    expect(wrapper.length).toBe(1);
  });
});
