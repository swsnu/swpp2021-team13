import { Checkbox, Input, Button } from "semantic-ui-react";

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
    <div className={`Choice${props.index}`} >
      <label>{`choice ${props.index}`}</label>
      <Input
        className='ChoiceInput'
        plsaceholder="choice content"
        value={`${props.choice}`}
        onChange={(event) => props.editContent(
          'choice_content',
          event.target.value,
          props.index)}
      />
      <Checkbox
        className='ChoiceCheckbox'
        type="checkbox"
        checked={props.isSolution}
        onChange={() => props.editContent(
          props.isSolution ? 'choice_not_solution' : 'choice_solution',
          null,
          props.index)}
      />
      <Button
        primary
        size="small"
        className="ChoiceDeleteButton"
        onClick={() => props.editContent(
          'choice_delete',
          "",
          props.index
        )}
      >
        Delete
      </Button>
    </div>
  )
}

export default Choice;
