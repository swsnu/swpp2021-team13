import React from 'react';

const CommentComponent = (props) => {
  return (
    <div className="CommentComponent">
      <h1 className="username">{props.username}</h1>
      <p className="content">{props.content}</p>
      {props.isCreator && (
        <button className="editButton" onClick={props.onClickEditCommentButton}>
          Edit
        </button>
      )}
      {props.isCreator && (
        <button
          className="deleteButton"
          onClick={props.onClickDeleteCommentButton}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CommentComponent;
