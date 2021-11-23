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
import { tagOptions } from '../ProblemSetSearch/ProblemSetSearch';
import {
  scopeOptions,
  difficultyOptions,
} from '../ProblemSetCreate/ProblemSetCreate';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetDetailProps extends PropsFromRedux {
  history: any;
}

interface ProblemSetDetailState {
  commentContent: string;
  isCommentEdit: boolean;
  isProblemSetEdit: boolean;
  editComment: CommentData | null;
  editProblemSetTitle: string;
  editProblemSetDescription: string;
  editProblemSetScope: string;
  editProblemSetDifficulty: string;
  editProblemSetTag: string;
}

class ProblemSetDetail extends Component<
  ProblemSetDetailProps & MatchProps,
  ProblemSetDetailState
> {
  constructor(props: ProblemSetDetailProps & MatchProps) {
    super(props);

    this.state = {
      commentContent: '',
      isCommentEdit: false,
      isProblemSetEdit: false,
      editComment: null,
      editProblemSetTitle: '',
      editProblemSetDescription: '',
      editProblemSetScope: '',
      editProblemSetDifficulty: '',
      editProblemSetTag: '',
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

  onClickBackToDetailButton = () => {
    this.setState({ isProblemSetEdit: false });
  };

  onClickEditProblemButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/edit/'
    );
  };

  onClickEditProblemSetButton = () => {
    this.setState({ isProblemSetEdit: true });
  };

  onClickConfirmProblemSetEditButton = () => {
    //this.props.onUpdateProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
    this.props.onGetAllSolvers(parseInt(this.props.match.params.id));
    this.setState({ isProblemSetEdit: false });
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
    this.setState({
      isCommentEdit: !this.state.isCommentEdit,
      editComment: comment,
    });
  };

  onClickDeleteCommentButton = (comment: CommentData) => {
    this.props.onDeleteComment(comment.id);
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
    this.setState({
      commentContent: '',
      isCommentEdit: false,
      editComment: null,
    });
  };

  onClickCommentButton = () => {
    if (this.state.isCommentEdit) {
      const comment = {
        id: this.state.editComment?.id,
        content: this.state.commentContent,
      };
      this.props.onUpdateComment(comment);
      this.setState({
        commentContent: '',
        isCommentEdit: false,
        editComment: null,
      });
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
    let tag = '';
    let difficulty = '';
    let created_time = '';
    if (this.props.selectedProblemSet) {
      const selectedUserID = this.props.selectedUser?.id;
      isCreator = this.props.selectedProblemSet.userID === selectedUserID;
      const solver = this.props.solvers.find(
        (element: Solver) => element.userID === selectedUserID
      );
      isSolver = solver !== undefined;

      tag = this.props.selectedProblemSet.tag.split('-')[1];
      let dict = difficultyOptions.find(
        (dict_ele) =>
          dict_ele['key'] === this.props.selectedProblemSet?.difficulty
      );
      if (dict) difficulty = dict['text'];
      let created_time_list =
        this.props.selectedProblemSet.created_time.split(/T|\./);
      created_time =
        created_time_list[0] + '\u00A0\u00A0' + created_time_list[1];
    } else {
      return <NotFound />;
    }

    return (
      <div className="ProblemSetDetail">
        {!this.state.isProblemSetEdit && (
          <Container text>
            <ProblemSetView
              creator={this.props.selectedUser.username}
              created_time={created_time}
              difficulty={difficulty}
              scope={this.props.selectedProblemSet.is_open}
              tag={tag}
              recommended_num={this.props.selectedProblemSet.recommended_num}
              solved_num={this.props.selectedProblemSet.solved_num}
              isCreator={isCreator}
              isSolver={isSolver}
              title={this.props.selectedProblemSet.title}
              content={this.props.selectedProblemSet.content}
              onClickBackButton={() => this.onClickBackButton()}
              onClickEditProblemButton={() => this.onClickEditProblemButton()}
              onClickEditProblemSetButton={() =>
                this.onClickEditProblemSetButton()
              }
              onClickDeleteProblemButton={() =>
                this.onClickDeleteProblemButton()
              }
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
                <Form.TextArea
                  value={this.state.commentContent}
                  className="commentInput"
                  onChange={(event) =>
                    this.setState({ commentContent: event.target.value })
                  }
                />
                {!this.state.isCommentEdit && (
                  <Button
                    primary
                    size="small"
                    className="commentConfirmButton"
                    onClick={() => this.onClickCommentButton()}
                  >
                    Comment
                  </Button>
                )}
                {this.state.isCommentEdit && (
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
        )}
        {this.state.isProblemSetEdit && (
          <Container text>
            <div className="ProblemSetEdit">
              <Button
                primary
                size="small"
                className="backToDetailButton"
                onClick={() => this.onClickBackToDetailButton()}
              >
                Back
              </Button>
              <Form>
                <Form.Field className="Title">
                  <label>Title</label>
                  <Input
                    className="problemSetTitleInput"
                    placeholder="Title"
                    value={this.props.selectedProblemSet.title}
                    onChange={(event) => {
                      this.setState({
                        editProblemSetTitle: event.target.value,
                      });
                    }}
                  />
                </Form.Field>

                <Form.TextArea
                  className="problemSetDescriptionInput"
                  label="Description"
                  placeholder="Description"
                  value={this.props.selectedProblemSet.content}
                  onChange={(event) => {
                    this.setState({
                      editProblemSetDescription: event.target.value,
                    });
                  }}
                />

                <Form.Group>
                  <Form.Dropdown
                    className="Scope"
                    item
                    options={scopeOptions}
                    label="Scope"
                    defaultValue={
                      this.props.selectedProblemSet.is_open
                        ? 'scope-public'
                        : 'scope-private'
                    }
                    onChange={(_, { value }) => {
                      this.setState({ editProblemSetScope: value as string });
                    }}
                  />

                  <Form.Dropdown
                    className="Tag"
                    item
                    options={tagOptions}
                    label="Tag"
                    defaultValue={this.props.selectedProblemSet.tag}
                    onChange={(_, { value }) => {
                      this.setState({ editProblemSetTag: value as string });
                    }}
                  />

                  <Form.Dropdown
                    className="Difficulty"
                    item
                    options={difficultyOptions}
                    label="Difficulty"
                    defaultValue={String(
                      this.props.selectedProblemSet.difficulty
                    )}
                    onChange={(_, { value }) => {
                      this.setState({
                        editProblemSetDifficulty: value as string,
                      });
                    }}
                  />
                </Form.Group>
              </Form>
              <Button
                primary
                size="small"
                className="confirmProblemSetEditButton"
                onClick={() => this.onClickConfirmProblemSetEditButton()}
              >
                Confirm
              </Button>
            </div>
          </Container>
        )}
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
