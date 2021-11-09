import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './ProblemSetCreate.css';
import * as actionCreators from '../../../store/actions/index';

class ProblemSetCreate extends Component {
  state = {
    title: [],
    problem: [],
    solution: [],
    numOfProblems: 0,
  };

  // TODO
  submitProblemSetHandler = () => {
    // this.props.onStoreTodo(this.state.title, this.state.content);
    // this.props.history.push('/todos');
  };
  addProblemHandler = () => {
    // this.props.onStoreTodo(this.state.title, this.state.content);
    // this.props.history.push('/todos');
  };
  removeProblemHandler = () => {
    // this.props.onStoreTodo(this.state.title, this.state.content);
    // this.props.history.push('/todos');
  };

  render() {
    let newProblemSet = (
      <div className="newProblemSet">
        <div className="title">
          <label>Title</label>
          <input placeholder="title here..."></input>
        </div>
        <div className="scope">
          <label>Scope</label>
          <select>
            <option value="none">=== select ===</option>
            <option value="scope-private">private</option>
            <option value="scope-public">public</option>
          </select>
        </div>
        <div className="tag">
          <label>Tag</label>
          <select>
            <option value="none">=== select ===</option>
            <option value="scope-100">philosophy</option>
            <option value="scope-180">psychology</option>
            <option value="scope-310">statistics</option>
            <option value="scope-320">economics</option>
            <option value="scope-340">political science</option>
            <option value="scope-410">mathematics</option>
            <option value="scope-420">physics</option>
            <option value="scope-430">chemistry</option>
            <option value="scope-470">biology</option>
            <option value="scope-500">engineering</option>
            <option value="scope-900">history</option>
          </select>
        </div>
        <div className="type">
          <label>Type</label>
          <select>
            <option value="none">=== select ===</option>
            <option value="scope-private">multiple choice</option>
          </select>
        </div>
        <div className="difficulty">
          <label>Difficulty</label>
          <select>
            <option value="none">=== select ===</option>
            <option value="scope-basic">basic</option>
            <option value="scope-intermediate">intermediate</option>
            <option value="scope-advanced">advanced</option>
          </select>
        </div>

        <div className="problemStatement">
          <label>Problem statement</label>
          <textarea
            rows={4}
            placeholder="problem here..."
            value={this.state.problem[this.state.numOfProblems]}
            // onChange={(event) =>
            //   let newProblem = [this.]
            //   this.setState({ ...this.state, problem: [...this.state.problem, event.target.value] })
            // }
          />
        </div>

        <label>Problem choice</label>
        <div className="problemChoice1">
          <label>choice 1 explanation</label>
          <input placeholder="explanation here..."></input>
        </div>
        <div className="problemChoice2">
          <label>choice 2 explanation</label>
          <input placeholder="explanation here..."></input>
        </div>
        <div className="problemChoice3">
          <label>choice 3 explanation</label>
          <input placeholder="explanation here..."></input>
        </div>
        <div className="problemChoice4">
          <label>choice 4 explanation</label>
          <input placeholder="explanation here..."></input>
        </div>

        <div className="solution">
          <label>Solution</label>
          <input type="radio" name="choice" value="first" /> 1
          <input type="radio" name="choice" value="second" /> 2
          <input type="radio" name="choice" value="third" /> 3
          <input type="radio" name="choice" value="fourth" /> 4
        </div>
        <button onClick={() => this.removeProblemHandler()}>
          Remove problem
        </button>
      </div>
    );

    return (
      <div className="ProblemSetCreate">
        <h1>ProblemSetCreate Page</h1>
        <NavLink id="problemsetcreate-back" to={`/problem/search`}>
          Back to problem set search
        </NavLink>

        {newProblemSet}

        <div>
          <button onClick={() => this.addProblemHandler()}>Add problem</button>
        </div>

        <div>
          <button onClick={() => this.submitProblemSetHandler()}>Submit</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onProblemSetCreate: (title, content) => {
      // dispatch(actionCreators.postTodo({ title: title, content: content }));
    },
  };
};

export default ProblemSetCreate;
