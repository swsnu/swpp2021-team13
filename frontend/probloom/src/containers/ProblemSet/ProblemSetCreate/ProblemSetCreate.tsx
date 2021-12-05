import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

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
    let newProblem: CreateProblemType = {
      problemType: 'multiple-choice',
      problemSetID: 0,
      problemNumber: index,
      content: 'problem here...',
      choices: ['', '', '', ''],
      solutions: [],
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
    this.props.onCreateProblemSet(
      this.state.title,
      this.state.scope,
      this.state.tag,
      this.state.difficulty,
      this.state.content,
      this.state.problems
    );
  };

  render() {
    const tabContentText = (currentProblem, index: number) => {
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
                solutions: currentProblem.solutions,
              };
            } else {
              let _currentProblem =
                currentProblem as CreateSubjectiveProblemInterface;
              editProblem = {
                problemType: 'subjective',
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
    let tabContentImage = (currentProblem, index: number) => {
      return (
        <>
          <Input
            id="problemset-problem-content-input-file-button"
            type="file"
            accept="image/*"
            onChange={(event) => {
              // console.log('************ index : ', index);

              if (!event.target.files) {
                return;
              }
              const file = event.target.files[0];
              // console.log(event.target.files[0]);

              const reader = new FileReader();
              reader.onloadend = () => {
                const editProblem: CreateProblemType = {
                  problemType: currentProblem.problemType,
                  problemSetID: currentProblem.problemSetID,
                  problemNumber: currentProblem.problemNumber,
                  content: reader.result as string,
                  choices: currentProblem.choices,
                  solutions: currentProblem.solutions,
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
              };
              reader.readAsDataURL(file);
            }}
          />

          <Image
            id="problemset-problem-content-input-file-preview"
            src={
              this.state.problems.filter(
                (problem) => problem.problemNumber === index
              )[0].content
            }
            alt=""
            size="huge"
          />
        </>
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
                panes={[
                  {
                    menuItem: `Make content in TEXT`,
                    render: () => (
                      <Tab.Pane>
                        {(() => tabContentText(currentProblem, index))()}
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: `Make content in IMAGE`,
                    render: () => (
                      <Tab.Pane>
                        {(() => tabContentImage(currentProblem, index))()}
                      </Tab.Pane>
                    ),
                  },
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
                let editProblem: any;
                if (value === 'multiple-choice') {
                  let _currentProblem =
                    currentProblem as CreateMultipleChoiceProblemInterface;
                  editProblem = {
                    problemType: value,
                    problemSetID: _currentProblem.problemSetID,
                    problemNumber: _currentProblem.problemNumber,
                    content: _currentProblem.content,
                    choices: _currentProblem.choices,
                    solutions: currentProblem.solutions,
                  };
                } else {
                  let _currentProblem =
                    currentProblem as CreateSubjectiveProblemInterface;
                  editProblem = {
                    problemType: value,
                    problemSetID: _currentProblem.problemSetID,
                    problemNumber: _currentProblem.problemNumber,
                    content: _currentProblem.content,
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

            {currentProblem.problemType === 'multiple-choice' && (
              <div>
                <label>Choose the correct answer</label>
                <div className="ProblemChoice1">
                  <label>choice 1</label>
                  <input
                    id="problemset-choice1-input"
                    placeholder="choice 1 here..."
                    onChange={(event) => {
                      const editChoice1 = event.target.value;
                      const newChoice1: string[] = [];
                      let _currentProblem =
                        currentProblem as CreateMultipleChoiceProblemInterface;
                      _currentProblem.choices.forEach((choice, index) => {
                        if (index === 0) {
                          newChoice1.push(editChoice1);
                        } else {
                          newChoice1.push(choice);
                        }
                      });

                      const editProblem: CreateProblemType = {
                        problemType: _currentProblem.problemType,
                        problemSetID: _currentProblem.problemSetID,
                        problemNumber: _currentProblem.problemNumber,
                        content: _currentProblem.content,
                        choices: newChoice1,
                        solutions: _currentProblem.solutions,
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
                  ></input>
                </div>
                <div className="ProblemChoice2">
                  <label>choice 2</label>
                  <input
                    id="problemset-choice2-input"
                    placeholder="choice 2 here..."
                    onChange={(event) => {
                      const editChoice2 = event.target.value;
                      const newChoice2: string[] = [];
                      let _currentProblem =
                        currentProblem as CreateMultipleChoiceProblemInterface;
                      _currentProblem.choices.forEach((choice, index) => {
                        if (index === 1) {
                          newChoice2.push(editChoice2);
                        } else {
                          newChoice2.push(choice);
                        }
                      });

                      const editProblem: CreateProblemType = {
                        problemType: _currentProblem.problemType,
                        problemSetID: _currentProblem.problemSetID,
                        problemNumber: _currentProblem.problemNumber,
                        content: _currentProblem.content,
                        choices: newChoice2,
                        solutions: _currentProblem.solutions,
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
                  ></input>
                </div>
                <div className="ProblemChoice3">
                  <label>choice 3</label>
                  <input
                    id="problemset-choice3-input"
                    placeholder="choice 3 here..."
                    onChange={(event) => {
                      const editChoice3 = event.target.value;
                      const newChoice3: string[] = [];
                      let _currentProblem =
                        currentProblem as CreateMultipleChoiceProblemInterface;
                      _currentProblem.choices.forEach((choice, index) => {
                        if (index === 2) {
                          newChoice3.push(editChoice3);
                        } else {
                          newChoice3.push(choice);
                        }
                      });

                      const editProblem: CreateProblemType = {
                        problemType: _currentProblem.problemType,
                        problemSetID: _currentProblem.problemSetID,
                        problemNumber: _currentProblem.problemNumber,
                        content: _currentProblem.content,
                        choices: newChoice3,
                        solutions: _currentProblem.solutions,
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
                  ></input>
                </div>
                <div className="ProblemChoice4">
                  <label>choice 4</label>
                  <input
                    id="problemset-choice4-input"
                    placeholder="choice 4 here..."
                    onChange={(event) => {
                      const editChoice4 = event.target.value;
                      const newChoice4: string[] = [];
                      let _currentProblem =
                        currentProblem as CreateMultipleChoiceProblemInterface;
                      _currentProblem.choices.forEach((choice, index) => {
                        if (index === 3) {
                          newChoice4.push(editChoice4);
                        } else {
                          newChoice4.push(choice);
                        }
                      });

                      const editProblem: CreateProblemType = {
                        problemType: _currentProblem.problemType,
                        problemSetID: _currentProblem.problemSetID,
                        problemNumber: _currentProblem.problemNumber,
                        content: _currentProblem.content,
                        choices: newChoice4,
                        solutions: _currentProblem.solutions,
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
                  ></input>
                </div>

                <div className="Solution">
                  <Form.Group grouped>
                    <label>Solution</label>
                    <Form.Field
                      id="problem-solution1-input"
                      label="1"
                      control="input"
                      type="checkbox"
                      onChange={() => {
                        let _currentProblem =
                          currentProblem as CreateMultipleChoiceProblemInterface;
                        let newSolutions;
                        if (_currentProblem.solutions.includes(1)) {
                          let arr = _currentProblem.solutions.filter(
                            (element) => element !== 1
                          );
                          newSolutions = [...Array.from(new Set([...arr]))];
                        } else {
                          newSolutions = [
                            ...Array.from(
                              new Set([..._currentProblem.solutions, 1])
                            ),
                          ];
                        }
                        const editProblem: CreateProblemType = {
                          problemType: _currentProblem.problemType,
                          problemSetID: _currentProblem.problemSetID,
                          problemNumber: _currentProblem.problemNumber,
                          content: _currentProblem.content,
                          choices: _currentProblem.choices,
                          solutions: newSolutions,
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
                    <Form.Field
                      id="problem-solution2-input"
                      label="2"
                      control="input"
                      type="checkbox"
                      onChange={() => {
                        let _currentProblem =
                          currentProblem as CreateMultipleChoiceProblemInterface;
                        let newSolutions;
                        if (_currentProblem.solutions.includes(2)) {
                          let arr = _currentProblem.solutions.filter(
                            (element) => element !== 2
                          );
                          newSolutions = [...Array.from(new Set([...arr]))];
                        } else {
                          newSolutions = [
                            ...Array.from(
                              new Set([..._currentProblem.solutions, 2])
                            ),
                          ];
                        }
                        const editProblem: CreateProblemType = {
                          problemType: _currentProblem.problemType,
                          problemSetID: _currentProblem.problemSetID,
                          problemNumber: _currentProblem.problemNumber,
                          content: _currentProblem.content,
                          choices: _currentProblem.choices,
                          solutions: newSolutions,
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
                    <Form.Field
                      id="problem-solution3-input"
                      label="3"
                      control="input"
                      type="checkbox"
                      onChange={() => {
                        let _currentProblem =
                          currentProblem as CreateMultipleChoiceProblemInterface;
                        let newSolutions;
                        if (_currentProblem.solutions.includes(3)) {
                          let arr = _currentProblem.solutions.filter(
                            (element) => element !== 3
                          );
                          newSolutions = [...Array.from(new Set([...arr]))];
                        } else {
                          newSolutions = [
                            ...Array.from(
                              new Set([..._currentProblem.solutions, 3])
                            ),
                          ];
                        }
                        const editProblem: CreateProblemType = {
                          problemType: _currentProblem.problemType,
                          problemSetID: _currentProblem.problemSetID,
                          problemNumber: _currentProblem.problemNumber,
                          content: _currentProblem.content,
                          choices: _currentProblem.choices,
                          solutions: newSolutions,
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
                    <Form.Field
                      id="problem-solution4-input"
                      label="4"
                      control="input"
                      type="checkbox"
                      onChange={() => {
                        let _currentProblem =
                          currentProblem as CreateMultipleChoiceProblemInterface;
                        let newSolutions;
                        if (_currentProblem.solutions.includes(4)) {
                          let arr = _currentProblem.solutions.filter(
                            (element) => element !== 4
                          );
                          newSolutions = [...Array.from(new Set([...arr]))];
                        } else {
                          newSolutions = [
                            ...Array.from(
                              new Set([..._currentProblem.solutions, 4])
                            ),
                          ];
                        }
                        const editProblem: CreateProblemType = {
                          problemType: _currentProblem.problemType,
                          problemSetID: _currentProblem.problemSetID,
                          problemNumber: _currentProblem.problemNumber,
                          content: _currentProblem.content,
                          choices: _currentProblem.choices,
                          solutions: newSolutions,
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
                  </Form.Group>
                </div>
              </div>
            )}

            {currentProblem.problemType === 'subjective' && (
              <div>
                <Form>
                  <Form.Field>
                    <label>Subjective problem answer</label>
                    <input
                      id="subjective-problem-answer-input"
                      placeholder="Write your answer here..."
                      onChange={(event) => {
                        const editAnswer = event.target.value;
                        const newAnswer: string[] = [];
                        let _currentProblem =
                          currentProblem as CreateSubjectiveProblemInterface;
                        _currentProblem.solutions.forEach((solution, index) => {
                          if (index === 0) {
                            newAnswer.push(editAnswer);
                          } else {
                            newAnswer.push(solution + '');
                          }
                        });

                        const editProblem: CreateProblemType = {
                          problemType: _currentProblem.problemType,
                          problemSetID: _currentProblem.problemSetID,
                          problemNumber: _currentProblem.problemNumber,
                          content: _currentProblem.content,
                          solutions: newAnswer,
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
                  </Form.Field>
                </Form>
              </div>
            )}

            <Button
              id="problemsetcreate-remove"
              onClick={() => this.removeProblemHandler(index)}
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
    console.log('this.state.problems', this.state.problems);
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
            <Form.Field className="Title">
              <label>Problem Set Title</label>
              <Input
                id="input-title"
                placeholder="Title"
                value={this.state.title}
                onChange={(event) => {
                  this.setState({ title: event.target.value });
                }}
              />
            </Form.Field>

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
  return {};
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
