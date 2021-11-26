import Solution from './Solution'
import { GetSubjectiveProblemResponse } from '../../store/reducers/problemReducerInterface'

interface SubjectiveProblemFormProps {
  problem: GetSubjectiveProblemResponse;
  editContent: (
    target: string,
    content?: any,
    index?: number
  ) => void;
}

const ProblemForm = (props: SubjectiveProblemFormProps) => {
  const answer = props.problem.solutions != undefined ?
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
      {answer}
    </div>
  );
};

export default ProblemForm;
