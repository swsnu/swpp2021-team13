import Solution from './Solution'
import { GetSubjectiveProblemResponse } from '../../store/actions/problemActionInterface'
import { Button, TextArea } from 'semantic-ui-react';

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
      index={index+1}
      solution={solution}
      editContent={props.editContent}
    />
  ));

  return (
    <div className="SubjectiveProblemForm">
      <div>
        <TextArea
          className='SPTextarea'
          rows={4}
          placeholder="Content"
          value={`${props.problem.content}`}
          onChange={(event) => props.editContent(
            'content',
            event.target.value)}
        />
      </div>
      <Button
        primary
        size="small"
        className="AddSolutionButton"
        onClick={() => props.editContent(
          'add_solution'
        )}
      >
          New
      </Button>
      {solutions}
    </div>
  );
};

export default SubjectiveProblemForm;
