export interface ChoiceProps {
  problemNumber: number;
  choice: any;
  editContent: (
    target: string,
    problemNumber: number,
    index: number,
    content: string
  ) => void;
}

const Choice = (props: ChoiceProps) => {
  return (
    <div className="MultipleChoice" >
      <label>choice {props.choice.number}</label>
      <input
        value={`${props.choice.content}`}
        onChange={(event) => props.editContent(
          'choice_content',
          props.problemNumber, 
          props.choice.number,
          event.target.value)}
      />
      <label>Solution</label>
      <input
        type="radio"
        value="1"
        checked={`${props.choice.isSolution}` === '1'}
        onChange={(event) => props.editContent(
          'choice_isSolution',
          props.problemNumber,
          props.choice.number,
          event.target.value)}
      />
    </div>
  )
}

export default Choice;
