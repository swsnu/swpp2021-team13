import React from 'react';

const ProblemSetView = (props) => {
  return (
    <div className="ProblemSetView">
      <button className="signOutButton" onClick={props.onClickSignOutButton}>
        Sign Out
      </button>
      <button className="backButton" onClick={props.onClickBackButton}>
        Back
      </button>
      {props.isCreator && (
        <button className="editButton" onClick={props.onClickEditProblemButton}>
          Edit
        </button>
      )}
      {props.isCreator && (
        <button
          className="deleteButton"
          onClick={props.onClickDeleteProblemButton}
        >
          Delete
        </button>
      )}
      <div className="ProblemSetBox">
        <h1 className="title">{props.title}</h1>
        <p className="content">{props.content}</p>
        <button
          className="solveButton"
          onClick={props.onClickSolveProblemButton}
        >
          Solve Problem
        </button>
        {(props.isCreator || props.isSolver) && (
          <button
            className="explanationButton"
            onClick={props.onClickExplanationButton}
          >
            Explanations
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemSetView;
