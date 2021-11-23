import React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';

const ProblemSetView = (props) => {
  return (
    <div className="ProblemSetView">
      <div className="ProblemSetBox">
        <Grid columns="equal">
          <Header as="h1">
            {props.title}
            <Header.Subheader>
              {props.creator}'s {props.scope ? 'public' : 'private'} problems
            </Header.Subheader>
            <Header.Subheader>Tag: {props.tag}</Header.Subheader>
            <Header.Subheader>Difficulty: {props.difficulty}</Header.Subheader>
            <Header.Subheader>
              Recommend: {props.recommended_num}
            </Header.Subheader>
            <Header.Subheader>Solve: {props.solved_num}</Header.Subheader>
          </Header>
          <Grid.Column textAlign="right">
            <Header as="h6" textAlign="right">
              Create: {props.created_time}
            </Header>
          </Grid.Column>
        </Grid>
        <Grid>
          <p className="content">{props.content}</p>
        </Grid>
        <Grid columns="equal">
          <Grid.Column>
            <Button
              primary
              className="solveButton"
              onClick={() => props.onClickSolveProblemButton()}
            >
              Solve Problems
            </Button>
            {(props.isCreator || props.isSolver) && (
              <Button
                secondary
                className="explanationButton"
                onClick={() => props.onClickExplanationButton()}
              >
                Explanations
              </Button>
            )}
          </Grid.Column>
          <Grid.Column textAlign="right">
            {props.isCreator && (
              <Button
                className="editProblemButton"
                onClick={() => props.onClickEditProblemButton()}
              >
                Edit Problems
              </Button>
            )}
            {props.isCreator && (
              <Button
                className="editProblemSetButton"
                onClick={() => props.onClickEditProblemSetButton()}
              >
                Edit Problem set
              </Button>
            )}
          </Grid.Column>
        </Grid>
        <Grid columns="equal">
          <Grid.Column textAlign="right">
            <Button
              className="backButton"
              onClick={() => props.onClickBackButton()}
            >
              Back
            </Button>
            {props.isCreator && (
              <Button
                negative
                className="deleteButton"
                onClick={() => props.onClickDeleteProblemButton()}
              >
                Delete
              </Button>
            )}
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
};

export default ProblemSetView;
