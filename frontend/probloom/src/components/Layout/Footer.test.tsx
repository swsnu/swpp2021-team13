import { shallow } from 'enzyme';

import Footer from './Footer';

describe('<Footer />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(<Footer />);
    const wrapper = component.find('.container-footer');
    expect(wrapper.length).toBe(1);
  });
});
