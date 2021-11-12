import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container, Header } from 'semantic-ui-react';

export interface NotFoundProps {
  message?: string;
}

const NotFound = (props: NotFoundProps & RouteComponentProps) => {
  const message = props.message ?? 'We could not find the requested page.';
  const goBackHandler = () => {
    props.history.goBack();
  };
  return (
    <Container textAlign="center">
      <Header as="h1">Not Found</Header>
      <p>{message}</p>
      <p>
        <Button secondary onClick={goBackHandler}>
          Go back
        </Button>
      </p>
    </Container>
  );
};

export default withRouter(NotFound);
