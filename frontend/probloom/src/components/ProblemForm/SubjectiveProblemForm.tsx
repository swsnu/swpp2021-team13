import Solution from './Solution'
import { GetSubjectiveProblemResponse } from '../../store/reducers/problemReducerInterface'

interface SubjectiveProblemFormProps {
  problem: GetSubjectiveProblemResponse;
  editContent: (
    target: string,
    content?: any,
    index?: any,
  ) => void;
}

const SubjectiveProblemForm = (props: SubjectiveProblemFormProps) => {
  const solutions = props.problem.solutions != undefined ?
  props.problem.solutions.map((solution, index) => (
    <Solution
      index={index}
      solution={solution}
      editContent={props.editContent}
    />
  ))
  : null;
  return (
    <div className="MultipleChoiceProblem">
      <div className="ProblemStatement">
        <textarea
          rows={4}
          value={`${props.problem.content}`}
          onChange={(event) => props.editContent(
            'content',
            event.target.value)}
        />
      </div>
      <button onClick={() => props.editContent(
        'add_solution'
      )}>New</button>
      {solutions}
    </div>
  );
};

export default SubjectiveProblemForm;
