import { Input } from "semantic-ui-react";

export interface SolutionProps {
  index: number;
  solution: string;
  editContent: (
    target: string,
    content?: string,
    index?: number,
  ) => void;
}
    
  const Solution = (props: SolutionProps) => {
    return (
      <div className={`Solution${props.index}`} >
        <label>{`solution ${props.index}`}</label>
        <Input
          className="SolutionInput"
          placeholdeer="solution content"
          value={`${props.solution}`}
          onChange={(event) => props.editContent(
            'solution_content',
            event.target.value,
            props.index)}
        />
      </div>
    )
  }
  
  export default Solution;
