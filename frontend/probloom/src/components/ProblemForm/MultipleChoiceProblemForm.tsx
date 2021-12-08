import Choice from './Choice';
import { GetMultipleChoiceProblemResponse } from '../../store/actions/problemActionInterface';
import { Button, Form, Grid } from 'semantic-ui-react';

interface MultipleChoiceProblemFormProps {
  problem: GetMultipleChoiceProblemResponse;
  editContent: (target: string, content?: any, index?: any) => void;
  deleteProb: () => void;
  saveProb: () => void;
}

const MultipleChoiceProblemForm = (props: MultipleChoiceProblemFormProps) => {
  const choices = props.problem.choices.map((choice, index) => (
    <Choice
      key={index}
      index={index+1}
      choice={choice}
      isSolution={
        props.problem.solution !== undefined && props.problem.solution.includes(index+1)
      }
      editContent={props.editContent}
    />
  ));
  return (
    <div className="MultipleChoiceProblemForm">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <label>Problem Content</label>
              <Form.TextArea
                className="MCPTextarea"
                rows={4}
                placeholder="content"
                value={`${props.problem.content}`}
                onChange={(event) => props.editContent('content', event.target.value)}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>

        {choices}
        <Grid.Row>
          <Grid.Column textAlign="right">
            <Button
              secondary
              size="small"
              className="DeleteButton"
              onClick={props.deleteProb}
            >
              Delete
            </Button>
            <Button
              primary
              size="small"
              className="SaveButton"
              onClick={props.saveProb}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default MultipleChoiceProblemForm;
