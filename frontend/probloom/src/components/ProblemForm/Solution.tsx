import { Button, Form, Grid, Input } from "semantic-ui-react";

export interface SolutionProps {
  index: number;
  solution: string;
  editContent: (
    target: string,
    content?: string,
    index?: number,
  ) => void;
}
    
const Solution = (props: SolutionProps) => {
  return (
    <Grid.Row className={`Solution${props.index}`} >
      <Grid.Column>
        <Form>
          <Form.Field>
            <label>{`solution ${props.index}`}</label>
            <Input
              className="SolutionInput"
              placeholder="content"
              label={
                <Button
                  className="SolutionDeleteButton"
                  onClick={() => props.editContent(
                    'solution_delete',
                    "",
                    props.index
                  )}
                >
                  Delete
                </Button>
              }
              labelPosition="right"
              value={`${props.solution}`}
              onChange={(event) => props.editContent(
                'solution_content',
                event.target.value,
                props.index)}
            />
          </Form.Field>
        </Form>
      </Grid.Column>
    </Grid.Row>
  )
}
  
export default Solution;
