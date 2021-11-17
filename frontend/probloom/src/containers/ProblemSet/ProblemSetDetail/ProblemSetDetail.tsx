import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  Button,
  Comment,
  Container,
  Form,
  Header,
  Input,
} from 'semantic-ui-react';
import ProblemSetView from '../../../components/ProblemSet/ProblemSetDetail/ProblemSetView';
import CommentComponent from '../../../components/ProblemSet/ProblemSetDetail/CommentComponent';
import { Solver } from '../../../store/reducers/problemReducer';
import { Comment as CommentData } from '../../../store/reducers/commentReducer';
import { AppDispatch, RootState } from '../../../store/store';
import NotFound from '../../../components/NotFound/NotFound';
import {
  getCommentsOfProblemSet,
  getProblemSet,
  getAllSolvers,
  deleteProblemSet,
  createComment,
  updateComment,
  deleteComment,
} from '../../../store/actions';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetDetailProps extends PropsFromRedux {
  history: any;
}

interface ProblemSetDetailState {
  commentContent: string;
  isEdit: boolean;
  editComment: CommentData | null;
}

class ProblemSetDetail extends Component<
  ProblemSetDetailProps & MatchProps,
  ProblemSetDetailState
> {
  constructor(props: ProblemSetDetailProps & MatchProps) {
    super(props);

    this.state = {
      commentContent: '',
      isEdit: false,
      editComment: null,
    };
  }

  componentDidMount() {
    this.props.onGetProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetAllSolvers(parseInt(this.props.match.params.id));
  }

  onClickBackButton = () => {
    this.props.history.push('/problem/search/');
  };

  onClickEditProblemButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/edit/'
    );
  };

  onClickDeleteProblemButton = () => {
    this.props.onDeleteProblemSet(parseInt(this.props.match.params.id));
    this.props.history.push('/problem/search/');
  };

  onClickSolveProblemButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/solve/'
    );
  };

  onClickExplanationButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/explanation/'
    );
  };

  onClickEditCommentButton = (comment: CommentData) => {
    this.setState({ isEdit: !this.state.isEdit, editComment: comment });
  };

  onClickDeleteCommentButton = (comment: CommentData) => {
    this.props.onDeleteComment(comment.id);
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
    this.setState({ commentContent: '', isEdit: false, editComment: null });
  };

  onClickCommentButton = () => {
    if (this.state.isEdit) {
      const comment = {
        id: this.state.editComment?.id,
        content: this.state.commentContent,
      };
      this.props.onUpdateComment(comment);
      this.setState({ commentContent: '', isEdit: false, editComment: null });
    } else {
      const comment = {
        userID: this.props.selectedUser?.id,
        username: this.props.selectedUser?.username,
        problemSetID: parseInt(this.props.match.params.id),
        content: this.state.commentContent,
      };
      this.props.onCreateComment(comment);
      this.setState({ commentContent: '' });
    }
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
  };

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    let isCreator = false;
    let isSolver = false;
    if (this.props.selectedProblemSet) {
      const selectedUserID = this.props.selectedUser?.id;
      isCreator = this.props.selectedProblemSet.userID === selectedUserID;
      const solver = this.props.solvers.find(
        (element: Solver) => element.userID === selectedUserID
      );
      isSolver = solver !== undefined;
    } else {
      return <NotFound />;
    }

    return (
      <div className="ProblemSetDetail">
        <Container text>
          <ProblemSetView
            creator={this.props.selectedUser?.username ?? '[deleted]'}
            isCreator={isCreator}
            isSolver={isSolver}
            title={this.props.selectedProblemSet.title}
            content={this.props.selectedProblemSet.content}
            onClickBackButton={() => this.onClickBackButton()}
            onClickEditProblemButton={() => this.onClickEditProblemButton()}
            onClickDeleteProblemButton={() => this.onClickDeleteProblemButton()}
            onClickSolveProblemButton={() => this.onClickSolveProblemButton()}
            onClickExplanationButton={() => this.onClickExplanationButton()}
          />
          <Comment.Group className="Comment">
            <Header as="h3" dividing>
              Comments
            </Header>

            {this.props.comments.map((com) => {
              isCreator = com.userID === this.props.selectedUser?.id;
              return (
                <CommentComponent
                  key={com.id}
                  username={com.username}
                  content={com.content}
                  isCreator={isCreator}
                  onClickEditCommentButton={() =>
                    this.onClickEditCommentButton(com)
                  }
                  onClickDeleteCommentButton={() =>
                    this.onClickDeleteCommentButton(com)
                  }
                />
              );
            })}

            <Form reply size="small">
              <Input
                value={this.state.commentContent}
                className="commentInput"
                onChange={(event) =>
                  this.setState({ commentContent: event.target.value })
                }
              />
              {!this.state.isEdit && (
                <Button
                  primary
                  size="small"
                  className="commentConfirmButton"
                  onClick={() => this.onClickCommentButton()}
                >
                  Comment
                </Button>
              )}
              {this.state.isEdit && (
                <Button
                  primary
                  size="small"
                  className="commentEditConfirmButton"
                  onClick={() => this.onClickCommentButton()}
                >
                  Edit Comment
                </Button>
              )}
            </Form>
          </Comment.Group>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUser: state.user.selectedUser,
    selectedProblemSet: state.problemset.selectedProblemSet,
    solvers: state.problemset.solvers,
    comments: state.comment.comments,
    selectedComment: state.comment.selectedComment,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    onGetCommentsOfProblemSet: (problemSetID: number) =>
      dispatch(getCommentsOfProblemSet(problemSetID)),
    onGetProblemSet: (problemSetID: number) =>
      dispatch(getProblemSet(problemSetID)),
    onGetAllSolvers: (problemSetID: number) =>
      dispatch(getAllSolvers(problemSetID)),
    onDeleteProblemSet: (problemSetID: number) =>
      dispatch(deleteProblemSet(problemSetID)),
    onCreateComment: (comment: any) => dispatch(createComment(comment)),
    onUpdateComment: (comment: any) => dispatch(updateComment(comment)),
    onDeleteComment: (commentID: number) => dispatch(deleteComment(commentID)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemSetDetail);
