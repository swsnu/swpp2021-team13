import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

import './ProblemSetEdit.css';
import * as actionCreators from '../../../store/actions/index';
import {
  ProblemSet,
  NewProblemSet,
  ProblemSetCreateState,
} from '../../../store/reducers/problemReducer';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetEditProps {
  history: any;
}

interface StateFromProps {
  selectedProblemSet: ProblemSet;
}

interface DispatchFromProps {
  onGetProblemSet: (problemSetID: number) => any;
  onEditProblemSet: (
    id: number,
    title: string,
    content: string,
    scope: string,
    tag: string,
    difficulty: string,
    problems: NewProblemSet[]
  ) => void;
}

type Props = ProblemSetEditProps &
  MatchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetCreateState;

class ProblemSetEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let title = '';
    let content = '';
    let scope = '';
    let tag = '';
    let difficulty = '';
    let problems = [];
    let numberOfProblems = 0;
    if (this.props.selectedProblemSet) {
      title = this.props.selectedProblemSet.title;
      content = this.props.selectedProblemSet.content;
      scope = this.props.selectedProblemSet.is_open ? 'true' : 'false';
      tag = this.props.selectedProblemSet.tag;
      difficulty = this.props.selectedProblemSet.difficulty.toString();
      problems = this.props.selectedProblems;
    }
    this.state = {
      title: title,
      content: content,
      scope: scope,
      tag: tag,
      difficulty: difficulty,
      problems: problems,
      numberOfProblems: numberOfProblems,
    };
  }

  componentDidMount() {
    this.props.onGetProblemSet(parseInt(this.props.match.params.id));
  }

  submitProblemSetEditHandler = () => {
    this.props.onEditProblemSet(
      this.props.selectedProblemSet.id,
      this.state.title,
      this.state.content,
      this.state.scope,
      this.state.tag,
      this.state.difficulty,
      this.state.problems
    );
  };

  render() {
    // ------------ Just for debugging messages -----------------
    // console.log('this.state.title', this.state.title);
    // console.log('this.state.scope', this.state.scope);
    // console.log('this.state.tag', this.state.tag);
    // console.log('this.state.difficulty', this.state.difficulty);
    // console.log('this.state.problems', this.state.problems);
    // console.log('this.props.selectedProblemSet', this.props.selectedProblemSet);
    // console.log('this.state.numberOfProblems', this.state.numberOfProblems);
    // ------------ Just for debugging messages -----------------
    const currentProblemSet = this.state.problems.map((problemSet, index) => {
      return (
        <div className="NewProblemSet" id={index.toString()}>
          <div className="Type">
            <label>Type</label>
            <select
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: event.target.value,
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
            >
              <option value="none">=== select ===</option>
              <option
                value="type-multiplechoice"
                selected={problemSet.problem_type === 'type-multiplechoice'}
              >
                multiple choice
              </option>
            </select>
          </div>

          <div className="ProblemStatement">
            <label>Problem statement</label>
            <textarea
              rows={4}
              value={`${problemSet.problem_statement}`}
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
              value={`${problemSet.choice[0]}`}
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
              value={`${problemSet.choice[1]}`}
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
              value={`${problemSet.choice[2]}`}
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
              value={`${problemSet.choice[3]}`}
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
              rows={4}
              value={`${problemSet.explanation}`}
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
        </div>
      );
    });

    return (
      <div className="ProblemSetEdit">
        <h1>ProblemSetEdit Page</h1>

        <NavLink
          id="problemsetedit-back"
          to={`/problem/${this.props.match.params.id}/detail/`}
        >
          Back to problem set search
        </NavLink>

        <div className="Title">
          <label>Title</label>
          <input
            value={`${this.state.title}`}
            onChange={(event) => {
              this.setState({
                ...this.state,
                title: event.target.value,
              });
            }}
          ></input>
        </div>

        <div className="Content">
          <label>Content</label>
          <input
            value={`${this.state.content}`}
            onChange={(event) => {
              this.setState({
                ...this.state,
                content: event.target.value,
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
            <option
              value="scope-private"
              selected={this.state.scope === 'false'}
            >
              private
            </option>
            <option value="scope-public" selected={this.state.scope === 'true'}>
              public
            </option>
          </select>
        </div>

        <div className="Tag">
          <label>Tag</label>
          <select
            onChange={(event) => {
              this.setState({
                ...this.state,
                tag: event.target.value,
              });
            }}
          >
            <option value="none">=== select ===</option>
            <option
              value="tag-philosophy"
              selected={this.state.tag === 'tag-philosophy'}
            >
              philosophy
            </option>
            <option
              value="tag-psychology"
              selected={this.state.tag === 'tag-psychology'}
            >
              psychology
            </option>
            <option
              value="tag-statistics"
              selected={this.state.tag === 'tag-statistics'}
            >
              statistics
            </option>
            <option
              value="tag-economics"
              selected={this.state.tag === 'tag-economics'}
            >
              economics
            </option>
            <option
              value="tag-mathematics"
              selected={this.state.tag === 'tag-mathematics'}
            >
              mathematics
            </option>
            <option
              value="tag-physics"
              selected={this.state.tag === 'tag-physics'}
            >
              physics
            </option>
            <option
              value="tag-chemistry"
              selected={this.state.tag === 'tag-chemistry'}
            >
              chemistry
            </option>
            <option
              value="tag-biology"
              selected={this.state.tag === 'tag-biology'}
            >
              biology
            </option>
            <option
              value="tag-engineering"
              selected={this.state.tag === 'tag-engineering'}
            >
              engineering
            </option>
            <option
              value="tag-history"
              selected={this.state.tag === 'tag-history'}
            >
              history
            </option>
          </select>
        </div>

        <div className="Difficulty">
          <label>Difficulty</label>
          <select
            onChange={(event) => {
              this.setState({
                ...this.state,
                difficulty: event.target.value,
              });
            }}
          >
            <option value="none">=== select ===</option>
            <option value="1" selected={this.state.difficulty === '1'}>
              basic
            </option>
            <option value="2" selected={this.state.difficulty === '2'}>
              intermediate
            </option>
            <option value="3" selected={this.state.difficulty === '3'}>
              advanced
            </option>
          </select>
        </div>

        {currentProblemSet}

        <div className="SubmitProblemSetButton">
          <button onClick={() => this.submitProblemSetEditHandler()}>
            Submit change
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedProblemSet: state.problemset.selectedProblemSet,
    selectedProblems: state.problemset.selectedProblems,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onGetProblemSet: (problemSetID: number) =>
      dispatch(actionCreators.getProblemSet(problemSetID)),

    onEditProblemSet: (
      id: number,
      title: string,
      content: string,
      scope: string,
      tag: string,
      difficulty: string,
      problems: NewProblemSet[]
    ) => {
      dispatch(
        actionCreators.editProblemSet(
          id,
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
)(ProblemSetEdit);
