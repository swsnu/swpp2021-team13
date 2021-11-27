import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button, Container, Form, Header, Input } from 'semantic-ui-react';
import { tagOptions2 } from '../ProblemSetSearch/ProblemSetSearch';

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

const scopeOptions = [
  {
    text: 'Private',
    value: 'scope-private',
  },
  { text: 'Public', value: 'scope-public' },
];

const difficultyOptions = [
  { key: 1, text: 'Basic', value: '1' },
  { key: 2, text: 'Intermediate', value: '2' },
  { key: 3, text: 'Advanced', value: '3' },
];

const typeOptions = [{ text: 'multiple choice', value: 'type-multiplechoice' }];

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
              value={`${problemSet.problem_statement}`}
              onChange={(event) => {
                const newProblem: NewProblemSet[] = [];
                const editProblem: NewProblemSet = {
                  index: problemSet.index,
                  problem_type: problemSet.problem_type,
                  problem_statement: event.target.value,
                  choice: problemSet.choice,
                  solution: problemSet.solution,
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
            options={tagOptions2['tag-science'].slice(1)}
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

        <div className="SubmitProblemSetButton">
          <button
            id="problemsetedit-submit"
            onClick={() => this.submitProblemSetEditHandler()}
          >
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
