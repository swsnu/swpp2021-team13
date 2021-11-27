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
  const solutionExist : any = props.problem.solutions;
  const solutions = solutionExist.map((solution, index) => (
    <Solution
      key={index}
      index={index}
      solution={solution}
      editContent={props.editContent}
    />
  ));

  return (
    <div className="SubjectiveProblemForm">
      <div>
        <textarea
          id='sp-textarea'
          rows={4}
          value={`${props.problem.content}`}
          onChange={(event) => props.editContent(
            'content',
            event.target.value)}
        />
      </div>
      <button 
        id='sp-addsolution'
        onClick={() => props.editContent(
        'add_solution'
        )}>New</button>
      {solutions}
    </div>
  );
};

export default SubjectiveProblemForm;
