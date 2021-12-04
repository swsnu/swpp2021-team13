import { shallow } from 'enzyme';
import SubjectiveProblemForm from './SubjectiveProblemForm';
import { GetSubjectiveProblemResponse } from '../../store/actions/problemActionInterface';

const subjectiveProblem : GetSubjectiveProblemResponse = {
  id: 1,
  problemType: 'subjective',
  problemSetID: 1,
  problemNumber: 1,
  creatorID: 1,
  createdTime: '',
  content: '',
  solverIDs: [],
  solutions: ['solution1', 'solution2'],
}

describe('<SubjectiveProblemForm />', () => {
  it('Clicked component should render without errors', () => {
    const component = shallow(
      <SubjectiveProblemForm
        problem={subjectiveProblem}
        editContent={(
          target: string,
          content?: any,
          index?: any
          )=>{{}}}/>);
    const wrapper = component.find('.SubjectiveProblemForm');
    expect(wrapper.length).toBe(1);
  });
});
