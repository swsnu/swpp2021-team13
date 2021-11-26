import { Comment } from 'semantic-ui-react';

const CommentComponent = (props) => {
  return (
    <Comment className="CommentComponent">
      <Comment.Author>
        {props.username}
        <Comment.Metadata>{props.createdTime}</Comment.Metadata>
      </Comment.Author>
      <Comment.Text>{props.content}</Comment.Text>
      <Comment.Actions>
        {props.isCreator && (
          <Comment.Action
            className="editButton"
            onClick={() => props.onClickEditCommentButton()}
          >
            Edit
          </Comment.Action>
        )}
        {props.isCreator && (
          <Comment.Action
            className="deleteButton"
            onClick={() => props.onClickDeleteCommentButton()}
          >
            Delete
          </Comment.Action>
        )}
      </Comment.Actions>
    </Comment>
  );
};

export default CommentComponent;
