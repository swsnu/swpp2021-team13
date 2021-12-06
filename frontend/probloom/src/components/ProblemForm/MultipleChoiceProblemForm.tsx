import Choice from './Choice';
import { GetMultipleChoiceProblemResponse } from '../../store/actions/problemActionInterface';
import { Button, Form } from 'semantic-ui-react';

interface MultipleChoiceProblemFormProps {
  problem: GetMultipleChoiceProblemResponse;
  editContent: (target: string, content?: any, index?: any) => void;
}

const MultipleChoiceProblemForm = (props: MultipleChoiceProblemFormProps) => {
  const choices = props.problem.choices.map((choice, index) => (
    <Choice
      key={index}
      index={index}
      choice={choice}
      isSolution={
        props.problem.solution !== undefined && index in props.problem.solution
      }
      editContent={props.editContent}
    />
  ));
  return (
    <div className="MultipleChoiceProblemForm">
      <Form.TextArea
        className="MCPTextarea"
        rows={4}
        placeholder="content"
        value={`${props.problem.content}`}
        onChange={(event) => props.editContent('content', event.target.value)}
      />
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
