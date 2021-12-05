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
import { Solver } from '../../../store/reducers/problemReducerInterface';
import ProblemSetView from '../../../components/ProblemSet/ProblemSetDetail/ProblemSetView';
import CommentComponent from '../../../components/ProblemSet/ProblemSetDetail/CommentComponent';
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
  updateProblemSet,
  getIsRecommender,
  updateRecommend,
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
    this.props.onGetIsRecommender(parseInt(this.props.match.params.id));

    if (this.props.selectedProblemSet) {
      this.setState({
        ...this.state,
        editProblemSetTitle: this.props.selectedProblemSet.title,
        editProblemSetDescription: this.props.selectedProblemSet.content,
        editProblemSetScope: this.props.selectedProblemSet.isOpen
          ? 'scope-public'
          : 'scope-private',
        editProblemSetDifficulty: String(
          this.props.selectedProblemSet.difficulty
        ),
        //editProblemSetTag: this.props.selectedProblemSet.tag
      });
    }
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
    let problemSet = {
      id: parseInt(this.props.match.params.id),
      title: this.state.editProblemSetTitle,
      content: this.state.editProblemSetDescription,
      isOpen: this.state.editProblemSetScope === 'scope-public' ? true : false,
      difficulty: parseInt(this.state.editProblemSetDifficulty),
      /////////////////////////////////tag:
    };

    this.props.onUpdateProblemSet(problemSet);
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

  onClickEditCommentButton = (comment: CommentData) => {
    this.setState({
      isCommentEdit: !this.state.isCommentEdit,
      editComment: comment,
    });
  };

  onClickDeleteCommentButton = (comment: CommentData) => {
    let idList = { id: comment.id, problemSetID: comment.problemSetID };
    this.props.onDeleteComment(idList);
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
        problemSetID: this.state.editComment?.problemSetID,
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
        problemSetID: parseInt(this.props.match.params.id),
        content: this.state.commentContent,
      };
      this.props.onCreateComment(comment);
      this.setState({ commentContent: '' });
    }
    this.props.onGetCommentsOfProblemSet(parseInt(this.props.match.params.id));
  };

  onClickRecommendationButton = () => {
    this.props.onUpdateRecommend(parseInt(this.props.match.params.id));
  };

  formatTime = (text: string) => {
    let timeList = text.split(/T|\./);
    let timeText = timeList[0] + '\u00A0\u00A0' + timeList[1];

    return timeText;
  };

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    let isCreator = false;
    let isSolver = false;
    let tag = '';
    let difficulty = '';
    let createdTime = '';
    let modifiedTime = '';
    if (this.props.selectedProblemSet) {
      const selectedUserID = this.props.selectedUser?.id;
      isCreator = this.props.selectedProblemSet.userID === selectedUserID;

      const solver = this.props.solvers.find(
        (element: Solver) => element.userID === selectedUserID
      );

      isSolver = solver !== undefined;

      //tag = this.props.selectedProblemSet.tag.split('-')[1];
      let dict = difficultyOptions.find(
        (dict_ele) =>
          dict_ele['key'] === this.props.selectedProblemSet?.difficulty
      );
      if (dict) difficulty = dict['text'];

      createdTime = this.formatTime(this.props.selectedProblemSet.createdTime);
      modifiedTime = this.formatTime(
        this.props.selectedProblemSet.modifiedTime
      );
    } else {
      return <NotFound />;
    }

    return (
      <div className="ProblemSetDetail">
        {!this.state.isProblemSetEdit && (
          <Container text>
            <ProblemSetView
              id={this.props.match.params.id}
              creator={this.props.selectedUser.username}
              createdTime={createdTime}
              modifiedTime={modifiedTime}
              difficulty={difficulty}
              scope={this.props.selectedProblemSet.isOpen}
              tag={tag}
              recommendedNum={this.props.selectedProblemSet.recommendedNum}
              solvedNum={this.props.selectedProblemSet.solvedNum}
              isCreator={isCreator}
              isSolver={isSolver}
              isRecommender={this.props.isRecommender}
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
              onClickRecommendationButton={() =>
                this.onClickRecommendationButton()
              }
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
                    createdTime={this.formatTime(com.createdTime)}
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
                    value={this.state.editProblemSetTitle}
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
                  value={this.state.editProblemSetDescription}
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
                    defaultValue={this.state.editProblemSetScope}
                    onChange={(_, { value }) => {
                      this.setState({ editProblemSetScope: value as string });
                    }}
                  />

                  <Form.Dropdown
                    className="Tag"
                    item
                    options={tagOptions}
                    label="Tag"
                    //defaultValue={this.state.editProblemSetTag}
                    onChange={(_, { value }) => {
                      this.setState({ editProblemSetTag: value as string });
                    }}
                  />

                  <Form.Dropdown
                    className="Difficulty"
                    item
                    options={difficultyOptions}
                    label="Difficulty"
                    defaultValue={this.state.editProblemSetDifficulty}
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
    isRecommender: state.problemset.isRecommender,
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
    onGetIsRecommender: (problemSetID: number) =>
      dispatch(getIsRecommender(problemSetID)),
    onUpdateRecommend: (problemSetID: number) =>
      dispatch(updateRecommend(problemSetID)),
    onUpdateProblemSet: (problemSet: any) =>
      dispatch(updateProblemSet(problemSet)),
    onDeleteProblemSet: (problemSetID: number) =>
      dispatch(deleteProblemSet(problemSetID)),
    onCreateComment: (comment: any) => dispatch(createComment(comment)),
    onUpdateComment: (comment: any) => dispatch(updateComment(comment)),
    onDeleteComment: (idList: any) => dispatch(deleteComment(idList)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemSetDetail);
