import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';

import './ProblemSetCreate.css';
import * as actionCreators from '../../../store/actions/index';

interface ProblemSetCreateProps {
  history: any;
}

interface ProblemSet {
  index: number;
  tag: string;
  type: string;
  difficulty: string;
  problem: string;
  choice: string[];
  solution: string;
  explanation: string;
}

interface ProblemSetCreateState {
  title: string;
  scope: string;
  problems: ProblemSet[];
  numberOfProblems: number;
}

interface StateFromProps {}

interface DispatchFromProps {
  onProblemSetCreate: () => void;
}

type Props = ProblemSetCreateProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetCreateState;

class ProblemSetCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: 'title here...',
      scope: '',
      problems: [],
      numberOfProblems: 0,
    };
  }

  addProblemHandler = (index: number) => {
    const newProblem = {
      index: index,
      tag: '',
      type: '',
      difficulty: '',
      problem: 'problem here...',
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

    this.setState({
      ...this.state,
      problems: deletedProblems,
      numberOfProblems: this.state.numberOfProblems - 1,
    });
  };

  submitProblemSetHandler = () => {
    // this.props.onStoreTodo(this.state.title, this.state.content);
    // this.props.history.push('/todos');
  };

  render() {
    const currentProblemSet = this.state.problems.map((problemSet, index) => {
      return (
        <div className="NewProblemSet" id={index.toString()}>
          <div className="Tag">
            <label>Tag</label>
            <select
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: event.target.value,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
            >
              <option value="none">=== select ===</option>
              <option value="tag-philosophy">philosophy</option>
              <option value="tag-psychology">psychology</option>
              <option value="tag-statistics">statistics</option>
              <option value="tag-economics">economics</option>
              <option value="tag-mathematics">mathematics</option>
              <option value="tag-physics">physics</option>
              <option value="tag-chemistry">chemistry</option>
              <option value="tag-biology">biology</option>
              <option value="tag-engineering">engineering</option>
              <option value="tag-history">history</option>
            </select>
          </div>

          <div className="Type">
            <label>Type</label>
            <select
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: event.target.value,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
            >
              <option value="none">=== select ===</option>
              <option value="type-multiplechoice">multiple choice</option>
            </select>
          </div>

          <div className="Difficulty">
            <label>Difficulty</label>
            <select
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: event.target.value,
                  problem: problemSet.problem,
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
            >
              <option value="none">=== select ===</option>
              <option value="difficulty-basic">basic</option>
              <option value="difficulty-intermediate">intermediate</option>
              <option value="difficulty-advanced">advanced</option>
            </select>
          </div>

          <div className="ProblemStatement">
            <label>Problem statement</label>
            <textarea
              rows={4}
              placeholder={`${problemSet.problem}`}
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: event.target.value,
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

                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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

                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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

                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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

                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="1"
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="2"
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="3"
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
              type="radio"
              name={`choice${problemSet.index}${index}`}
              value="4"
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
              rows={4}
              placeholder={`${problemSet.explanation}`}
              onChange={(event) => {
                const newProblem: ProblemSet[] = [];
                const editProblem: ProblemSet = {
                  index: problemSet.index,
                  tag: problemSet.tag,
                  type: problemSet.type,
                  difficulty: problemSet.difficulty,
                  problem: problemSet.problem,
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
          <button onClick={() => this.removeProblemHandler(problemSet.index)}>
            Remove problem
          </button>
        </div>
      );
    });

    // ------------ Just for debugging messages -----------------
    // console.log('this.state.title', this.state.title);
    // console.log('this.state.scope', this.state.scope);
    console.log('this.state.problems', this.state.problems);
    // console.log('this.state.numberOfProblems', this.state.numberOfProblems);
    // ------------ Just for debugging messages -----------------

    return (
      <div className="ProblemSetCreate">
        <h1>ProblemSetCreate Page</h1>

        <NavLink id="problemsetcreate-back" to={`/problem/search`}>
          Back to problem set search
        </NavLink>

        <div className="Title">
          <label>Title</label>
          <input
            placeholder={`${this.state.title}`}
            onChange={(event) => {
              this.setState({
                ...this.state,
                title: event.target.value,
              });
            }}
          ></input>
        </div>

        <div className="Scope">
          <label>Scope</label>
          <select
            onChange={(event) => {
              this.setState({
                ...this.state,
                scope: event.target.value,
              });
            }}
          >
            <option value="none">=== select ===</option>
            <option value="scope-private">private</option>
            <option value="scope-public">public</option>
          </select>
        </div>

        {currentProblemSet}

        <div className="AddProblemButton">
          <button
            onClick={() => this.addProblemHandler(this.state.numberOfProblems)}
          >
            Add problem
          </button>
        </div>

        <div className="SubmitProblemSetButton">
          <button onClick={() => this.submitProblemSetHandler()}>Submit</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onProblemSetCreate: () => {
      // dispatch(actionCreators.postTodo({ title: title, content: content }));
    },
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetCreate);
