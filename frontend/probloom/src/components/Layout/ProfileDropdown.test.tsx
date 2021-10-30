import { mount, shallow } from 'enzyme';

import ProfileDropdown from './ProfileDropdown';

describe('<ProfileDropdown />', () => {
  it('ProfileDropdown component should render without errors', () => {
    const component = shallow(<ProfileDropdown username={'hello'} />);
    const wrapper = component.find('.ProfileDropdown');
    expect(wrapper.length).toBe(1);

    const componentWillUnmount = jest.spyOn(
      component.instance(),
      'componentWillUnmount'
    );
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it(`should render`, () => {
    const spyCDM = jest.spyOn(ProfileDropdown.prototype, 'componentDidMount');
    const component = mount(<ProfileDropdown username={'hello'} />);

    expect(spyCDM).toHaveBeenCalled();
  });

  it('ProfileDropdown component click', () => {
    const component = shallow(<ProfileDropdown username={'hello'} />);
    const wrapper = component.find('.ProfileDropdown #profile-button').at(0);
    wrapper.simulate('click');
    expect(component.state('displayMenu')).toEqual(true);

    wrapper.simulate('click');
    expect(component.state('displayMenu')).toEqual(false);
  });

  it('closeDropdownMenu()', () => {
    const component = mount(<ProfileDropdown username={'hello'} />);
    const wrapper = component.find('.ProfileDropdown #profile-button').at(0);
    wrapper.simulate('blur');
    expect(component.state('displayMenu')).toEqual(false);
  });
});
