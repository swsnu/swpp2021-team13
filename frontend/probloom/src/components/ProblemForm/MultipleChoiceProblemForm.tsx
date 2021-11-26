import Choice from './Choice'
import { GetMultipleChoiceProblemResponse } from '../../store/reducers/problemReducerInterface'

interface MultipleChoiceProblemFormProps {
  problem: GetMultipleChoiceProblemResponse;
  editContent: (
    target: string,
    content?: any,
    index?: any,
  ) => void;
}

const MultipleChoiceProblemForm = (
  props: MultipleChoiceProblemFormProps
) => {
  const choices = props.problem.choices.map((choice, index) => (
    <Choice
      index={index}
      choice={choice}
      isSolution={
        props.problem.solution != undefined 
        && index in props.problem.solution
      }
      editContent={props.editContent}
    />
  ))
  return (
    <div className="MultipleChoiceProblem">
      <div>
        <textarea
          rows={4}
          value={`${props.problem.content}`}
          onChange={(event) => props.editContent(
            'content', event.target.value
          )}
        />
        <button onClick={() => props.editContent(
          'add_choice'
        )}>New</button>
      </div>
      {choices}
    </div>
  );
};

export default MultipleChoiceProblemForm;
