export interface ChoiceProps {
  index: number;
  choice: string;
  isSolution: boolean;
  editContent: (
    target: string,
    content?: any,
    index?: any,
  ) => void;
}

const Choice = (props: ChoiceProps) => {
  return (
    <div className="Choice" >
      <label>{`choice ${props.index}`}</label>
      <input
        id='choice-input'
        value={`${props.choice}`}
        onChange={(event) => props.editContent(
          'choice_content',
          event.target.value,
          props.index)}
      />
      <input
        id='choice-checkbox'
        type="checkbox"
        checked={props.isSolution}
        onChange={() => props.editContent(
          props.isSolution ? 'choice_not_solution' : 'choice_solution',
          null,
          props.index)}
      />
    </div>
  )
}

export default Choice;
