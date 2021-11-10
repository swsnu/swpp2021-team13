import React, { Component } from 'react';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import ProblemSetView from '../../../components/ProblemSet/ProblemSetDetail/ProblemSetView';
import CommentCompoent from '../../../components/ProblemSet/ProblemSetDetail/CommentComponent';
import { User } from '../../../store/reducers/userReducer';
import { ProblemSet } from '../../../store/reducers/problemReducer';
import { Comment } from '../../../store/reducers/commentReducer';
import { AppDispatch } from '../../../store/store';
import { RouteComponentProps } from 'react-router';
import {
  signOut,
  getCommentsOfProblemSet,
  getProblemSet,
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
}

interface StateFromProps {
  selectedUser: User;
  selectedProblemSet: ProblemSet;
  comments: Comment[];
  selectedComment: Comment | null;
}

interface DispatchFromProps {
  onSignOut: (user: any) => any;
  onGetCommentsOfProblemSet: (problemSetID: number) => any;
  onGetProblemSet: (problemSetID: number) => any;
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
    };
  }

  componentDidMount() {
    this.props.onGetProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
  }

  render() {
    if (this.props.selectedUser === null) {
      this.props.history.push('/signin');
    }
    if (this.props.selectedUser) {
      if (this.props.selectedUser.logged_in === false) {
        this.props.history.push('/signin');
      }
    }

    //const isCreator =
    //  this.props.selectedProblemSet.userID === this.props.selectedUser.id;
    //const isSolver =

    return (
      <div className="ProblemSetDetail">
        <ProblemSetView />
        <div className="Comment">
          <label>Comment</label>
          {this.props.comments.map((com, index) => {
            return (
              <CommentCompoent
                key={index}
                username={com.username}
                content={com.content}
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
          {/*<button
            className="commentComfirmButton"
            onClick={() => this.onClickCommentButton()}
          >
            Sign Up
          </button>*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedUser: state.user.selectedUser,
    selectedProblemSet: state.problemset.selectedProblmeSet,
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
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetDetail);
