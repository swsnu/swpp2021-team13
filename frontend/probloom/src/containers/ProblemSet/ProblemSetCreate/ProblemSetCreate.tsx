import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import * as actionCreators from '../../../store/actions/index';
import {
  NewProblemSet,
  ProblemSetCreateState,
} from '../../../store/reducers/problemReducer';
import { Button, Container, Form, Header, Input } from 'semantic-ui-react';
import { tagOptions } from '../ProblemSetSearch/ProblemSetSearch';

interface ProblemSetCreateProps {
  history: any;
}

interface StateFromProps {}

interface DispatchFromProps {
  onCreateProblemSet: (
    title: string,
    content: string,
    scope: string,
    tag: string,
    difficulty: string,
    problems: NewProblemSet[]
  ) => void;
}

type Props = ProblemSetCreateProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetCreateState;

export const scopeOptions = [
  { text: 'Private', value: 'scope-private' },
  { text: 'Public', value: 'scope-public' },
];

export const difficultyOptions = [
  { key: 1, text: 'Basic', value: '1' },
  { key: 2, text: 'Intermediate', value: '2' },
  { key: 3, text: 'Advanced', value: '3' },
];

const typeOptions = [{ text: 'multiple choice', value: 'type-multiplechoice' }];

class ProblemSetCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: '',
      content: '',
      scope: 'scope-private',
      tag: '',
      difficulty: '1',
      problems: [],
      numberOfProblems: 0,
    };
  }

  addProblemHandler = (index: number) => {
    const newProblem = {
      index: index,
      problem_type: '',
      problem_statement: 'problem here...',
      choice: ['', '', '', ''],
      solution: '',
      explanation: 'explanation here...',
    };

    this.setState({
      ...this.state,
      problems: [...this.state.problems, newProblem],
      numberOfProblems: this.state.numberOfProblems + 1,
    });
  };

  // confirmProblemHandler = () => {
  // };
  removeProblemHandler = (index: number) => {
    const deletedProblems = this.state.problems.filter((problem) => {
      return problem.index !== index;
    });
    deletedProblems.forEach((element) => {
      if (element.index > index) {
        element.index -= 1;
      }
    });

    this.setState({
      ...this.state,
      problems: deletedProblems,
      numberOfProblems: this.state.numberOfProblems - 1,
    });
  };

  submitProblemSetHandler = () => {
    this.props.onCreateProblemSet(
      this.state.title,
      this.state.content,
      this.state.scope,
      this.state.tag,
      this.state.difficulty,
      this.state.problems
    );
  };

  render() {
    const currentProblemSet = this.state.problems.map((problemSet, index) => {
      return (
        <div className="NewProblemSet" key={index.toString()}>
          <Form.Dropdown
            className="Type"
            item
            options={typeOptions}
            label="Type"
            onChange={(_, { value }) => {
              const newProblem: NewProblemSet[] = [];
              const editProblem: NewProblemSet = {
                index: problemSet.index,
                problem_type: value as string,
                problem_statement: problemSet.problem_statement,
                choice: problemSet.choice,
                solution: problemSet.solution,
                explanation: problemSet.explanation,
              };
              this.state.problems.forEach((problem) => {
                if (problem.index === index) {
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

          <div className="ProblemStatement">
            <label>Problem statement</label>
            <textarea
              id="problemset-problem-statement-input"
              rows={4}
              placeholder={`${problemSet.problem_statement}`}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: event.target.value,
                  choice: problemSet.choice,
                  solution: problemSet.solution,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
          <label>Answer choice</label>
          <div className="ProblemChoice1">
            <label>choice 1</label>
            <input
              id="problemset-choice1-input"
              placeholder="choice 1 here..."
              onChange={(event) => {
                const editChoice1 = event.target.value;
                const newChoice1: string[] = [];
                problemSet.choice.forEach((choice, index) => {
                  if (index === 0) {
                    newChoice1.push(editChoice1);
                  } else {
                    newChoice1.push(choice);
                  }
                });

                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: newChoice1,
                  solution: problemSet.solution,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
                const editChoice1 = event.target.value;
                const newChoice1: string[] = [];
                problemSet.choice.forEach((choice, index) => {
                  if (index === 1) {
                    newChoice1.push(editChoice1);
                  } else {
                    newChoice1.push(choice);
                  }
                });

                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: newChoice1,
                  solution: problemSet.solution,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
                const editChoice1 = event.target.value;
                const newChoice1: string[] = [];
                problemSet.choice.forEach((choice, index) => {
                  if (index === 2) {
                    newChoice1.push(editChoice1);
                  } else {
                    newChoice1.push(choice);
                  }
                });

                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: newChoice1,
                  solution: problemSet.solution,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
                const editChoice1 = event.target.value;
                const newChoice1: string[] = [];
                problemSet.choice.forEach((choice, index) => {
                  if (index === 3) {
                    newChoice1.push(editChoice1);
                  } else {
                    newChoice1.push(choice);
                  }
                });

                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: newChoice1,
                  solution: problemSet.solution,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
            <label>Solution</label>
            <input
              id="problemset-solution1-input"
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="1"
              checked={`${problemSet.solution}` === '1'}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: problemSet.choice,
                  solution: event.target.value,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
            1
            <input
              id="problemset-solution2-input"
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="2"
              checked={`${problemSet.solution}` === '2'}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: problemSet.choice,
                  solution: event.target.value,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
            2
            <input
              id="problemset-solution3-input"
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="3"
              checked={`${problemSet.solution}` === '3'}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: problemSet.choice,
                  solution: event.target.value,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
            3
            <input
              id="problemset-solution4-input"
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="4"
              checked={`${problemSet.solution}` === '4'}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: problemSet.choice,
                  solution: event.target.value,
                  explanation: problemSet.explanation,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
            4
          </div>
          <div className="SolutionExplanation">
            <label>Solution explanation</label>
            <textarea
              id="problemset-solution-explanation-input"
              rows={4}
              placeholder={`${problemSet.explanation}`}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: problemSet.problem_statement,
                  choice: problemSet.choice,
                  solution: problemSet.solution,
                  explanation: event.target.value,
                };
                this.state.problems.forEach((problem) => {
                  if (problem.index === index) {
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
          {/* <button onClick={() => this.confirmProblemHandler()}>
            Confirm problem
          </button> */}
          <button
            id="problemsetcreate-remove"
            onClick={() => this.removeProblemHandler(problemSet.index)}
          >
            Remove problem
          </button>
        </div>
      );
    });

    // ------------ Just for debugging messages -----------------
    // console.log('this.state.title', this.state.title);
    // console.log('this.state.scope', this.state.scope);
    // console.log('this.state.tag', this.state.tag);
    // console.log('this.state.difficulty', this.state.difficulty);
    // console.log('this.state.problems', this.state.problems);
    // console.log('this.state.numberOfProblems', this.state.numberOfProblems);
    // ------------ Just for debugging messages -----------------

    return (
      <div className="ProblemSetCreate">
        <Container>
          <Header as="h1">
            New Problem
            <Button
              floated="right"
              id="problemsetcreate-back"
              onClick={() => this.props.history.goBack()}
            >
              Back
            </Button>
          </Header>

          <Form>
            <Form.Field className="Title">
              <label>Title</label>
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
              id="input-content"
              label="Content"
              placeholder="Content"
              value={this.state.content}
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
                className="Tag"
                item
                options={tagOptions.slice(1)}
                label="Tag"
                defaultValue="tag-philosophy"
                onChange={(_, { value }) => {
                  this.setState({ tag: value as string });
                }}
              />

              <Form.Dropdown
                className="Difficulty"
                item
                options={difficultyOptions}
                label="Difficulty"
                defaultValue="1"
                onChange={(_, { value }) => {
                  this.setState({ difficulty: value as string });
                }}
              />
            </Form.Group>

            {currentProblemSet}

            <Button
              secondary
              id="problemsetcreate-add"
              onClick={() =>
                this.addProblemHandler(this.state.numberOfProblems)
              }
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
      content: string,
      scope: string,
      tag: string,
      difficulty: string,
      problems: NewProblemSet[]
    ) => {
      dispatch(
        actionCreators.createProblemSet(
          title,
          content,
          scope,
          tag,
          difficulty,
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
