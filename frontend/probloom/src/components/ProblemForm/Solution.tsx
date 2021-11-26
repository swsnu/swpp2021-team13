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
      <div className="Solution" >
        <label>solution {props.index}</label>
        <input
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
