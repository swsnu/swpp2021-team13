export interface SolutionProps {
  problemNumber: number;
  solution: any;
  editContent: (
    target: string,
    problemNumber: number,
    index: number,
    content: string
  ) => void;
}
  
const Solution = (props: SolutionProps) => {
  return (
    <div className="Solution" >
      <label>solution {props.solution.number}</label>
      <input
          value={`${props.solution.content}`}
          onChange={(event) => props.editContent(
            'solution_content',
            props.problemNumber, 
            props.solution.number,
            event.target.value)}
      />
    </div>
  )
}
  
export default Solution;
  