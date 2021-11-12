import React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';

const ProblemSetView = (props) => {
  return (
    <div className="ProblemSetView">
      <div className="ProblemSetBox">
        <Header as="h1">
          {props.title}
          <Header.Subheader>By {props.creator}</Header.Subheader>
        </Header>
        <p className="content">{props.content}</p>
        <Grid columns="equal">
          <Grid.Column>
            <Button
              primary
              className="solveButton"
              onClick={() => props.onClickSolveProblemButton()}
            >
              Solve Problem
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
            <Button
              className="backButton"
              onClick={() => props.onClickBackButton()}
            >
              Back
            </Button>
            {props.isCreator && (
              <Button
                className="editButton"
                onClick={() => props.onClickEditProblemButton}
              >
                Edit
              </Button>
            )}
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
