import { Input, Form, Grid } from 'semantic-ui-react';

export interface ChoiceProps {
  index: number;
  choice: string;
  isSolution: boolean;
  editContent: (target: string, content?: any, index?: any) => void;
}

const Choice = (props: ChoiceProps) => {
  return (
    <Grid.Row className={`Choice${props.index}`}>
      <Grid.Column>
        <Form>
          <Form.Group inline>
            <label>{`choice ${props.index}`}</label>
            <Form.Checkbox
              className="ChoiceCheckbox"
              type="checkbox"
              label="Answer?"
              checked={props.isSolution}
              onChange={() =>
                props.editContent(
                  props.isSolution ? 'choice_not_solution' : 'choice_solution',
                  null,
                  props.index
                )
              }
            />
          </Form.Group>
          <Form.Field>
            <Input
              className="ChoiceInput"
              placeholder="content"
              //              label={
              //                <Button
              //                  className="ChoiceDeleteButton"
              //                  onClick={() => props.editContent(
              //                    'choice_delete',
              //                    "",
              //                    props.index
              //                  )}
              //                >
              //                  Delete
              //                </Button>
              //              }
              labelPosition="right"
              value={`${props.choice}`}
              onChange={(event) =>
                props.editContent(
                  'choice_content',
                  event.target.value,
                  props.index
                )
              }
            />
          </Form.Field>
        </Form>
      </Grid.Column>
    </Grid.Row>
  );
};

export default Choice;
