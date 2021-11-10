import React, { Component } from 'react';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import ProblemSetView from '../../../components/ProblemSet/ProblemSetDetail/ProblemSetView';
import CommentComponent from '../../../components/ProblemSet/ProblemSetDetail/CommentComponent';
import { User } from '../../../store/reducers/userReducer';
import { ProblemSet, Solver } from '../../../store/reducers/problemReducer';
import { Comment } from '../../../store/reducers/commentReducer';
import { AppDispatch } from '../../../store/store';
import { RouteComponentProps } from 'react-router';
import NotFound from '../../../components/NotFound/NotFound';
import {
  signOut,
  getCommentsOfProblemSet,
  getProblemSet,
  getAllSolvers,
  deleteProblemSet,
  createComment,
  updateComment,
  deleteComment,
} from '../../../store/actions';
import './ProblemSetDetail.css';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetDetailProps {
  history: any;
}

interface ProblemSetDetailState {
  commentContent: string;
  isEdit: boolean;
  editComment: Comment | null;
}

interface StateFromProps {
  selectedUser: User;
  selectedProblemSet: ProblemSet;
  solvers: Solver[];
  comments: Comment[];
  selectedComment: Comment | null;
}

interface DispatchFromProps {
  onSignOut: (user: any) => any;
  onGetCommentsOfProblemSet: (problemSetID: number) => any;
  onGetProblemSet: (problemSetID: number) => any;
  onGetAllSolvers: (problemSetID: number) => any;
  onDeleteProblemSet: (problemSetID: number) => any;
  onCreateComment: (comment: Comment) => any;
  onUpdateComment: (comment: any) => any;
  onDeleteComment: (commentID: number) => any;
}

type Props = ProblemSetDetailProps &
  MatchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetDetailState;

class ProblemSetDetail extends Component<Props, State> {
  constructor(props: Props) {
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

  onClickSignOutButton = () => {
    this.props.onSignOut(this.props.selectedUser);
  };

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

  onClickEditCommentButton = (comment: Comment) => {
    this.setState({ isEdit: true, editComment: comment });
  };

  onClickDeleteCommentButton = (comment: Comment) => {
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
        userID: this.props.selectedUser.id,
        username: this.props.selectedUser.username,
        problemSetID: parseInt(this.props.match.params.id),
        content: this.state.commentContent,
      };
      this.props.onCreateComment(comment);
      this.setState({ commentContent: '' });
    }
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
  };

  render() {
    if (this.props.selectedUser === null) {
      this.props.history.push('/signin');
    }
    if (this.props.selectedUser) {
      if (this.props.selectedUser.logged_in === false) {
        this.props.history.push('/signin');
      }
    }

    let isCreator = false;
    let isSolver = false;
    if (this.props.selectedProblemSet) {
      isCreator =
        this.props.selectedProblemSet.userID === this.props.selectedUser.id;
      const solver = this.props.solvers.find(
        (element: Solver) => element.userID === this.props.selectedUser.id
      );
      isSolver = solver === undefined;
    } else {
      return <NotFound />;
    }

    return (
      <div className="ProblemSetDetail">
        <ProblemSetView
          isCreator={isCreator}
          isSolver={isSolver}
          title={this.props.selectedProblemSet.title}
          content={this.props.selectedProblemSet.content}
          onClickSignOutButton={() => this.onClickSignOutButton()}
          onClickBackButton={() => this.onClickBackButton()}
          onClickEditProblemButton={() => this.onClickEditProblemButton()}
          onClickDeleteProblemButton={() => this.onClickDeleteProblemButton()}
          onClickSolveProblemButton={() => this.onClickSolveProblemButton()}
          onClickExplanationButton={() => this.onClickExplanationButton()}
        />
        <div className="Comment">
          <label>Comment</label>
          {this.props.comments.map((com) => {
            isCreator = com.userID === this.props.selectedUser.id;
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
          <input
            type="text"
            value={this.state.commentContent}
            className="commentInput"
            onChange={(event) =>
              this.setState({ commentContent: event.target.value })
            }
          />
          {!this.state.isEdit && (
            <button
              className="commentComfirmButton"
              onClick={() => this.onClickCommentButton()}
            >
              comment
            </button>
          )}
          {this.state.isEdit && (
            <button
              className="commentEditComfirmButton"
              onClick={() => this.onClickCommentButton()}
            >
              edit
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
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
    onSignOut: (user: any) => dispatch(signOut(user)),
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

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetDetail);
