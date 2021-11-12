import { Button, Table } from 'semantic-ui-react';

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
    <Table.Row className="ProblemSetSearchResult">
      <Table.Cell>
        <Button basic color="black" id="detail" onClick={props.clickProb}>
          {props.title}
        </Button>
      </Table.Cell>
      <Table.Cell>{new Date(props.date).toDateString()}</Table.Cell>
      <Table.Cell>{props.creator}</Table.Cell>
      <Table.Cell>{props.solved}</Table.Cell>
      <Table.Cell>{props.recommended}</Table.Cell>
    </Table.Row>
  );
};
export default ProblemSetSearchResult;
