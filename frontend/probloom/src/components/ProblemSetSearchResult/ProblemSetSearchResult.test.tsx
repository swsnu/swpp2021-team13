import { shallow } from 'enzyme';

import ProblemSetSearchResult from './ProblemSetSearchResult';

describe('<Problem />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(<ProblemSetSearchResult title='title' 
        date='date' creator='creator' solved={0} recommended={0} clickProb={()=>{{}}}/>);
    const wrapper = component.find('.ProblemSetSearchResult');
    expect(wrapper.length).toBe(1);
  });
});
