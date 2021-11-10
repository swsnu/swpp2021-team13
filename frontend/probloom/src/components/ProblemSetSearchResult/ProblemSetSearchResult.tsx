export interface ProblemSetSearchResultProps {
    title: string;
    date: string;
    creator: string;
    solved: number;
    recommended: number;
    clickProb: () => void;
}

const ProblemSetSearchResult = (props: ProblemSetSearchResultProps) => {
    return (
        <div className="ProblemSetSearchResult">
            <div className="info">
                <button id='detail' 
                    onClick={props.clickProb}>{props.title}</button>
                <div className="sub">
                    <p>{props.date}</p>
                    <p>{props.creator}</p>
                </div>
            </div>
            <div className="stat">
                <p>{props.solved}</p>
                <p>{props.recommended}</p>
            </div>
        </div>
    )
}
export default ProblemSetSearchResult;