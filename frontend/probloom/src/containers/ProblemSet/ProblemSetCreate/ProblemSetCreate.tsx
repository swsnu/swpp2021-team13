import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { Redirect } from 'react-router';

import * as actionCreators from '../../../store/actions';
import {
  CreateProblemType,
  CreateMultipleChoiceProblemInterface,
  CreateSubjectiveProblemInterface,
  CreateProblemSetRequest,
} from '../../../store/reducers/problemReducerInterface';
import {
  Button,
  Container,
  Divider,
  Form,
  Header,
  Image,
  Input,
  Tab,
} from 'semantic-ui-react';
import { tagOptions1, tagOptions2 } from '../ProblemSetSearch/ProblemSetSearch';

interface ProblemSetCreateProps {
  history: any;
}

interface StateFromProps {}

interface DispatchFromProps {
  onCreateProblemSet: (
    title: string,
    scope: string,
    tag: string[],
    difficulty: number,
    content: string,
    problems: CreateProblemType[]
  ) => void;
}

type Props = ProblemSetCreateProps &
  typeof statePropTypes &
  typeof actionPropTypes;

type State = CreateProblemSetRequest;

export const scopeOptions = [
  { text: 'Private', value: 'scope-private' },
  { text: 'Public', value: 'scope-public' },
];

export const difficultyOptions = [
  { key: 1, text: 'Everyone', value: 1 },
  { key: 2, text: 'Elementary School', value: 2 },
  { key: 3, text: 'Middle School', value: 3 },
  { key: 4, text: 'High School', value: 4 },
  { key: 5, text: 'Undergraduate', value: 5 },
  { key: 6, text: 'Graduate', value: 6 },
];

const typeOptions = [
  { text: 'multiple choice question', value: 'multiple-choice' },
  { text: 'subjective question', value: 'subjective' },
];

class ProblemSetCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: '',
      scope: 'scope-private',
      tag: ['tag-all', ''],
      difficulty: 1,
      content: '',
      problems: [],
    };
  }

  addProblemHandler = (index: number) => {
    let newProblem: CreateMultipleChoiceProblemInterface = {
      problemType: 'multiple-choice',
      problemSetID: 0,
      problemNumber: index + 1,
      content: 'problem here...',
      choices: ['', '', '', ''],
      solution: [],
    };

    this.setState({
      ...this.state,
      problems: [...this.state.problems, newProblem],
    });
  };

  removeProblemHandler = (index: number) => {
    const deletedProblems = this.state.problems.filter((problem) => {
      return problem.problemNumber !== index;
    });
    deletedProblems.forEach((element) => {
      if (element.problemNumber > index) {
        element.problemNumber -= 1;
      }
    });

    this.setState({
      ...this.state,
      problems: deletedProblems,
    });
  };

  submitProblemSetHandler = () => {
    if (this.state.problems.length > 0) {
      this.props.onCreateProblemSet(
        this.state.title,
        this.state.scope,
        this.state.tag,
        this.state.difficulty,
        this.state.content,
        this.state.problems
      );
    } else {
      alert('You need to make at least 1 problem in your problem set.');
    }
  };

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    const tabContentText = (
      currentProblem: CreateProblemType,
      index: number
    ) => {
      return (
        <Form.TextArea
          id="problemset-problem-content-input"
          label="Problem Content"
          placeholder="Content : Explain your problem set"
          onChange={(event) => {
            let editProblem: any;
            if (currentProblem.problemType === 'multiple-choice') {
              let _currentProblem =
                currentProblem as CreateMultipleChoiceProblemInterface;
              editProblem = {
                problemType: _currentProblem.problemType,
                problemSetID: _currentProblem.problemSetID,
                problemNumber: _currentProblem.problemNumber,
                content: event.target.value,
                choices: _currentProblem.choices,
                solution: _currentProblem.solution,
              };
            } else {
              let _currentProblem =
                currentProblem as CreateSubjectiveProblemInterface;
              editProblem = {
                problemType: _currentProblem.problemType,
                problemSetID: _currentProblem.problemSetID,
                problemNumber: _currentProblem.problemNumber,
                content: event.target.value,
                solutions: _currentProblem.solutions,
              };
            }

            const newProblem: CreateProblemType[] = [];
            this.state.problems.forEach((problem) => {
              if (problem.problemNumber === index) {
                newProblem.push(editProblem);
              } else {
                newProblem.push(problem);
              }
            });

            this.setState({
              ...this.state,
              problems: newProblem,
            });
          }}
        />
      );
    };

    // let tabContentImage = (currentProblem, index: number) => {
    //   return (
    //     <>
    //       <Input
    //         id="problemset-problem-content-input-file-button"
    //         type="file"
    //         accept="image/*"
    //         onChange={(event) => {
    //           if (!event.target.files) {
    //             return;
    //           }
    //           const file = event.target.files[0];

    //           const reader = new FileReader();
    //           reader.onloadend = () => {
    //             let editProblem: CreateProblemType;
    //             if (currentProblem.problemType === 'multiple-choice') {
    //               let _currentProblem =
    //                 currentProblem as CreateMultipleChoiceProblemInterface;
    //               editProblem = {
    //                 problemType: _currentProblem.problemType,
    //                 problemSetID: _currentProblem.problemSetID,
    //                 problemNumber: _currentProblem.problemNumber,
    //                 content: reader.result as string,
    //                 choices: _currentProblem.choices,
    //                 solution: _currentProblem.solution,
    //               };
    //             } else {
    //               let _currentProblem =
    //                 currentProblem as CreateSubjectiveProblemInterface;
    //               editProblem = {
    //                 problemType: _currentProblem.problemType,
    //                 problemSetID: _currentProblem.problemSetID,
    //                 problemNumber: _currentProblem.problemNumber,
    //                 content: reader.result as string,
    //                 solutions: _currentProblem.solutions,
    //               };
    //             }

    //             const newProblem: CreateProblemType[] = [];
    //             this.state.problems.forEach((problem) => {
    //               if (problem.problemNumber === index) {
    //                 newProblem.push(editProblem);
    //               } else {
    //                 newProblem.push(problem);
    //               }
    //             });
    //             this.setState({
    //               ...this.state,
    //               problems: newProblem,
    //             });
    //           };
    //           reader.readAsDataURL(file);
    //         }}
    //       />

    //       <Image
    //         id="problemset-problem-content-input-file-preview"
    //         src={
    //           this.state.problems.filter(
    //             (problem) => problem.problemNumber === index
    //           )[0].content
    //         }
    //         alt=""
    //         size="huge"
    //       />
    //     </>
    //   );
    // };

    let createChoice = (
      currentProblem: CreateMultipleChoiceProblemInterface,
      index: number,
      order: number
    ) => {
      return (
        <>
          <Form.Field
            id={`problem-choice${order}-input`}
            label={`choice ${order}`}
            control="input"
            placeholder={`choice ${order} here...`}
            onChange={(event) => {
              const editChoice = event.target.value;
              const newChoice: string[] = [];
              let _currentProblem =
                currentProblem as CreateMultipleChoiceProblemInterface;
              _currentProblem.choices.forEach((choice, index) => {
                if (index === order - 1) {
                  newChoice.push(editChoice);
                } else {
                  newChoice.push(choice);
                }
              });

              const editProblem: CreateMultipleChoiceProblemInterface = {
                problemType: _currentProblem.problemType,
                problemSetID: _currentProblem.problemSetID,
                problemNumber: _currentProblem.problemNumber,
                content: _currentProblem.content,
                choices: newChoice,
                solution: _currentProblem.solution,
              };

              const newProblem: CreateProblemType[] = [];
              this.state.problems.forEach((problem) => {
                if (problem.problemNumber === index + 1) {
                  newProblem.push(editProblem);
                } else {
                  newProblem.push(problem);
                }
              });

              this.setState({
                ...this.state,
                problems: newProblem,
              });
            }}
          ></Form.Field>
        </>
      );
    };

    let createSolution = (
      currentProblem: CreateMultipleChoiceProblemInterface,
      index: number,
      order: number
    ) => {
      return (
        <Form.Field
          id={`problem-solution${order}-input`}
          label={`${order}`}
          control="input"
          type="checkbox"
          onChange={() => {
            let _currentProblem =
              currentProblem as CreateMultipleChoiceProblemInterface;
            let newSolution;
            if (_currentProblem.solution.includes(order)) {
              let arr = _currentProblem.solution.filter(
                (element) => element !== order
              );
              newSolution = [...Array.from(new Set([...arr]))];
            } else {
              newSolution = [
                ...Array.from(new Set([..._currentProblem.solution, order])),
              ];
            }
            const editProblem: CreateProblemType = {
              problemType: _currentProblem.problemType,
              problemSetID: _currentProblem.problemSetID,
              problemNumber: _currentProblem.problemNumber,
              content: _currentProblem.content,
              choices: _currentProblem.choices,
              solution: newSolution,
            };

            const newProblem: CreateProblemType[] = [];
            this.state.problems.forEach((problem) => {
              if (problem.problemNumber === index) {
                newProblem.push(editProblem);
              } else {
                newProblem.push(problem);
              }
            });

            this.setState({
              ...this.state,
              problems: newProblem,
            });
          }}
        />
      );
    };

    const newProblems = this.state.problems.map(
      (currentProblem: CreateProblemType, index) => {
        return (
          <div className="NewProblem" key={index.toString()}>
            <div>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Divider />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>

            <div className="ProblemContent">
              <Tab
                id="asdfg"
                panes={[
                  {
                    menuItem: `Make content`,
                    render: () => (
                      <Tab.Pane id="qwerty">
                        {(() => tabContentText(currentProblem, index + 1))()}
                        {/* {(() => tabContentImage(currentProblem, index + 1))()} */}
                      </Tab.Pane>
                    ),
                  },
                  // {
                  //   menuItem: `Make content in IMAGE`,
                  //   render: () => (
                  //     <Tab.Pane id="qwerty2">
                  //       {(() => tabContentImage(currentProblem, index))()}
                  //     </Tab.Pane>
                  //   ),
                  // },
                ]}
              />
            </div>

            <Form.Dropdown
              className="ProblemType"
              item
              options={typeOptions}
              label="Type"
              defaultValue="multiple-choice"
              onChange={(_, { value }) => {
                // Always change type
                let editProblem: any;

                if (value === 'multiple-choice') {
                  // 1. from subjective to multiple-choice
                  editProblem = {
                    problemType: value,
                    problemSetID: currentProblem.problemSetID,
                    problemNumber: currentProblem.problemNumber,
                    content: currentProblem.content,
                    choices: ['', '', '', ''], // initialize with empty list
                    solution: [], // initialize with empty list
                  };
                } else {
                  // 2. from multiple-choice to subjective
                  editProblem = {
                    problemType: value,
                    problemSetID: currentProblem.problemSetID,
                    problemNumber: currentProblem.problemNumber,
                    content: currentProblem.content,
                    solutions: [], // initialize with empty list
                  };
                }

                const newProblem: CreateProblemType[] = [];
                this.state.problems.forEach((problem) => {
                  if (problem.problemNumber === index + 1) {
                    newProblem.push(editProblem);
                  } else {
                    newProblem.push(problem);
                  }
                });

                this.setState({
                  ...this.state,
                  problems: newProblem,
                });
              }}
            />

            {currentProblem.problemType === 'multiple-choice' && (
              <div>
                <label>Choose the correct answer</label>
                <div className="ProblemChoice1">
                  {(() => createChoice(currentProblem, index, 1))()}
                </div>
                <div className="ProblemChoice2">
                  {(() => createChoice(currentProblem, index, 2))()}
                </div>
                <div className="ProblemChoice3">
                  {(() => createChoice(currentProblem, index, 3))()}
                </div>
                <div className="ProblemChoice4">
                  {(() => createChoice(currentProblem, index, 4))()}
                </div>

                <div className="Solution">
                  <Form.Group grouped>
                    <label>Solution</label>
                    {(() => createSolution(currentProblem, index + 1, 1))()}
                    {(() => createSolution(currentProblem, index + 1, 2))()}
                    {(() => createSolution(currentProblem, index + 1, 3))()}
                    {(() => createSolution(currentProblem, index + 1, 4))()}
                  </Form.Group>
                </div>
              </div>
            )}

            {currentProblem.problemType === 'subjective' && (
              <div>
                <Form.Field
                  id="subjective-problem-answer-input"
                  label="Subjective problem answer"
                  control="input"
                  placeholder="Write your answer here..."
                  onChange={(event) => {
                    const editAnswer: string = event.target.value;
                    // const newAnswer: string[] = [];
                    let _currentProblem =
                      currentProblem as CreateSubjectiveProblemInterface;
                    // _currentProblem.solutions.forEach((solution, index) => {
                    //   if (index === 0) {
                    //     newAnswer.push(editAnswer);
                    //   } else {
                    //     newAnswer.push(solution + '');
                    //   }
                    // });

                    const editProblem: CreateProblemType = {
                      problemType: _currentProblem.problemType,
                      problemSetID: _currentProblem.problemSetID,
                      problemNumber: _currentProblem.problemNumber,
                      content: _currentProblem.content,
                      solutions: [editAnswer],
                    };

                    const newProblem: CreateProblemType[] = [];
                    this.state.problems.forEach((problem) => {
                      if (problem.problemNumber === index + 1) {
                        newProblem.push(editProblem);
                      } else {
                        newProblem.push(problem);
                      }
                    });

                    this.setState({
                      ...this.state,
                      problems: newProblem,
                    });
                  }}
                />
              </div>
            )}

            <Button
              id="problemsetcreate-remove"
              onClick={() => this.removeProblemHandler(index + 1)}
            >
              Remove problem
            </Button>
          </div>
        );
      }
    );

    // ------------ Just for debugging messages -----------------
    // console.log('this.state.title', this.state.title);
    // console.log('this.state.scope', this.state.scope);
    // console.log('this.state.tag', this.state.tag);
    // console.log('this.state.difficulty', this.state.difficulty);
    // console.log('this.state.content', this.state.content);
    // console.log('this.state.problems', this.state.problems);
    // ------------ Just for debugging messages -----------------

    return (
      <div className="ProblemSetCreate">
        <Container>
          <Header as="h1">
            Create a New Problem Set
            <Button
              floated="right"
              id="problemsetcreate-back"
              onClick={() => this.props.history.goBack()}
            >
              Back
            </Button>
          </Header>
          <Divider />

          <Form>
            <Form.Field
              id="input-title"
              label="Problem Set Title"
              placeholder="Title"
              control="input"
              onChange={(event) => {
                this.setState({ title: event.target.value });
              }}
            ></Form.Field>

            <Form.TextArea
              id="input-content-text"
              label="Problem Set Content"
              placeholder="Content : Explain your problem set"
              value={this.state.content}
              cols={50}
              onChange={(event) => {
                this.setState({ content: event.target.value });
              }}
            />

            <Form.Group>
              <Form.Dropdown
                className="Scope"
                item
                options={scopeOptions}
                label="Scope"
                defaultValue="scope-private"
                onChange={(_, { value }) => {
                  this.setState({ scope: value as string });
                }}
              />

              <Form.Dropdown
                className="Tag1"
                item
                options={tagOptions1.slice(0)}
                label="Tag1"
                defaultValue="tag-all"
                onChange={(_, { value }) => {
                  this.setState({ tag: [value as string, this.state.tag[1]] });
                }}
              />

              <Form.Dropdown
                className="Tag2"
                item
                options={tagOptions2[this.state.tag[0]].slice(0)}
                label="Tag2"
                defaultValue="tag-all"
                onChange={(_, { value }) => {
                  this.setState({ tag: [this.state.tag[0], value as string] });
                }}
              />

              <Form.Dropdown
                className="Difficulty"
                item
                options={difficultyOptions}
                label="Difficulty"
                defaultValue={1}
                onChange={(_, { value }) => {
                  this.setState({ difficulty: value as number });
                }}
              />
            </Form.Group>

            {newProblems}

            <Divider />
            <Button
              secondary
              id="problemsetcreate-add"
              onClick={() => this.addProblemHandler(this.state.problems.length)}
            >
              Add problem
            </Button>
            <Button
              primary
              id="problemsetcreate-submit"
              floated="right"
              onClick={() => this.submitProblemSetHandler()}
            >
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { selectedUser: state.user.selectedUser };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCreateProblemSet: (
      title: string,
      scope: string,
      tag: string[],
      difficulty: number,
      content: string,
      problems: CreateProblemType[]
    ) => {
      dispatch(
        actionCreators.createProblemSet(
          title,
          scope,
          tag,
          difficulty,
          content,
          problems
        )
      );
    },
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetCreate);
