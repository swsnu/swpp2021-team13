import { shallow } from 'enzyme';

import Layout from './Layout';

describe('<Layout />', () => {
  it('Layout component should render 1', () => {
    const component = shallow(
      <Layout username={'test'} footer={true}>
        <h1>test</h1>
      </Layout>
    );
    const wrapper = component.find('.layout');
    expect(wrapper.length).toBe(1);
  });

  it('Layout component should render 2', () => {
    const component = shallow(
      <Layout username={null} footer={true}>
        <h1>test</h1>
      </Layout>
    );
    const wrapper = component.find('.layout');
    expect(wrapper.length).toBe(1);
  });
});
