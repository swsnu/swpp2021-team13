import Solution from './Solution'
import { GetSubjectiveProblemResponse } from '../../store/actions/problemActionInterface'
import { Button, Form, Grid } from 'semantic-ui-react';

interface SubjectiveProblemFormProps {
  problem: GetSubjectiveProblemResponse;
  editContent: (target: string, content?: any, index?: any) => void;
  deleteProb: () => void;
  saveProb: () => void;
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
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Form>
              <label>Problem Content</label>
              <Form.TextArea
                className='SPTextarea'
                rows={4}
                placeholder="Content"
                value={`${props.problem.content}`}
                onChange={(event) => props.editContent(
                  'content',
                  event.target.value)}
              />
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button
              primary
              size="small"
              className="AddSolutionButton"
              onClick={() => props.editContent(
                'add_solution'
              )}
            >
              New solution
            </Button>
          </Grid.Column>
        </Grid.Row>
        {solutions}
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

export default SubjectiveProblemForm;
