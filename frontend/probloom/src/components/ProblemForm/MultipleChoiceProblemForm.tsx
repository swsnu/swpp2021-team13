import Choice from './Choice'

interface MultipelChoiceProblemProps {
  problem: any;
  editContent: (
    target: string,
    problemNumber: number,
    choiceNumber: number,
    content: string
  ) => void;
}

const MultipleChoiceProblem = (props: MultipelChoiceProblemProps) => {
  const choices = props.problem.choice.map((choice) => (
    <Choice
      problemNumber={props.problem.number}
      choice={choice}
      editContent={props.editContent}
    />
  ))
  return (
    <div className="MultipleChoiceProblem">
      <div className="ProblemStatement">
        <label>Problem statement</label>
        <textarea
          id="problemset-problem-statement-input"
          rows={4}
          value={`${props.problem.problem_statement}`}
          onChange={(event) => props.editContent(
            'statement',
            props.problem.number, 
            0,
            event.target.value)}
        />
      </div>
      {choices}
    </div>
  );
};

export default MultipleChoiceProblem;
