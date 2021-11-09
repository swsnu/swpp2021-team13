import { shallow } from 'enzyme';

import Prob from './Prob';

describe('<Problem />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(<Prob title='title' 
        date='date' creator='creator' solved={0} recommended={0} clickProb={()=>{return}}/>);
    const wrapper = component.find('.Problem');
    expect(wrapper.length).toBe(1);
  });
});
