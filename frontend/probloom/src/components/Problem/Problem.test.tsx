import { shallow } from 'enzyme';

import Problem from './Problem';

describe('<Problem />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(<Problem title='title' 
        date='date' creator='creator' solved={0} recommended={0} clickProb={()=>{return}}/>);
    const wrapper = component.find('.Problem');
    expect(wrapper.length).toBe(1);
  });
});
