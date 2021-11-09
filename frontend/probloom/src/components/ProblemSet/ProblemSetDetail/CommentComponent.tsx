import React from 'react';

const CommentCompoent = (props) => {
  return (
    <div className="CommentComponent">
      <h1 className="username">{props.username}</h1>
      <p className="content">{props.content}</p>
      {props.isCreator && (
        <button className="editButton" onClick={props.onClickEditButton}>
          Edit
        </button>
      )}
      {props.isCreator && (
        <button className="deleteButton" onClick={props.onClickDeleteButton}>
          Delete
        </button>
      )}
    </div>
  );
};

export default CommentCompoent;
