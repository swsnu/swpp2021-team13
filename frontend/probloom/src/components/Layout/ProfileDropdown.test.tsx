import { shallow } from 'enzyme';

import ProfileDropdown from './ProfileDropdown';

describe('<ProfileDropdown />', () => {
  it('ProfileDropdown component should render without errors', () => {
    const component = shallow(<ProfileDropdown username={'hello'} />);
    const wrapper = component.find('.ProfileDropdown');
    expect(wrapper.length).toBe(1);
  });

  it('ProfileDropdown component click', () => {
    const component = shallow(<ProfileDropdown username={'hello'} />);
    const wrapper = component.find('.ProfileDropdown #profile-button').at(0);
    wrapper.simulate('click');
    expect(component.state('displayMenu')).toEqual(true);

    wrapper.simulate('click');
    expect(component.state('displayMenu')).toEqual(false);
  });
});
