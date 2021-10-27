import { RouteComponentProps, withRouter } from 'react-router-dom';

export interface NotFoundProps {
  message?: string;
}

const NotFound = (props: NotFoundProps & RouteComponentProps) => {
  const message = props.message ?? 'We could not find the requested page.';
  const goBackHandler = () => {
    props.history.goBack();
  };
  return (
    <div>
      <h1>Not Found</h1>
      <p>{message}</p>
      <p>
        <button onClick={goBackHandler}>Go back</button>
      </p>
    </div>
  );
};

export default withRouter(NotFound);
