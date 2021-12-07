import Choice from './Choice';
import { GetMultipleChoiceProblemResponse } from '../../store/actions/problemActionInterface';
import { Button, TextArea } from 'semantic-ui-react';

interface MultipleChoiceProblemFormProps {
  problem: GetMultipleChoiceProblemResponse;
  editContent: (target: string, content?: any, index?: any) => void;
}

const MultipleChoiceProblemForm = (props: MultipleChoiceProblemFormProps) => {
  const choices = props.problem.choices.map((choice, index) => (
    <Choice
      key={index}
      index={index+1}
      choice={choice}
      isSolution={
        props.problem.solution !== undefined && props.problem.solution.includes(index)
      }
      editContent={props.editContent}
    />
  ));
  return (
    <div className="MultipleChoiceProblemForm">
      <div>
        <TextArea
          className="MCPTextarea"
          rows={4}
          placeholder="content"
          value={`${props.problem.content}`}
          onChange={(event) => props.editContent('content', event.target.value)}
        />
      </div>
      <Button
        primary
        size="small"
        className="AddChoiceButton"
        onClick={() => props.editContent('add_choice')}
      >
        New
      </Button>
      {choices}
    </div>
  );
};

export default MultipleChoiceProblemForm;
