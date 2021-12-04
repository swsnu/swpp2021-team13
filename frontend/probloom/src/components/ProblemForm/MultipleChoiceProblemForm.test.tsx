import { shallow } from 'enzyme';
import MultipleChoiceProblemForm from './MultipleChoiceProblemForm';
import { GetMultipleChoiceProblemResponse } from '../../store/actions/problemActionInterface';

const multipleChoiceProblem : GetMultipleChoiceProblemResponse = {
  id: 1,
  problemType: 'multiple-choice',
  problemSetID: 1,
  problemNumber: 1,
  creatorID: 1,
  createdTime: '',
  content: '',
  solverIDs: [],
  choices: ['choice1', 'choice2'],
  solution: [1],
}

describe('<MultipleChoiceProblemForm />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(
      <MultipleChoiceProblemForm
        problem={multipleChoiceProblem}
        editContent={(
          target: string,
          content?: any,
          index?: any
          )=>{{}}}/>);
    const wrapper = component.find('.MultipleChoiceProblemForm');
    expect(wrapper.length).toBe(1);
  });
});
