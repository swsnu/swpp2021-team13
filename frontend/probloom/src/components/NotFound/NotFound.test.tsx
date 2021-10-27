import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router';
import NotFound from './NotFound';

describe('<NotFound />', () => {
  it('displays title', () => {
    const app = (
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    render(app);
    expect(screen.getByRole('heading')).toHaveTextContent(/not found/i);
  });

  it('displays message when given', () => {
    const app = (
      <MemoryRouter>
        <NotFound message="TEST_MESSAGE" />
      </MemoryRouter>
    );
    render(app);
    expect(screen.getByText('TEST_MESSAGE')).toBeDefined();
  });

  it('goes back when "Go back" button is clicked', async () => {
    const app = (
      <MemoryRouter initialEntries={['/', '/unused']} initialIndex={1}>
        <Switch>
          <Route exact path="/" render={() => <div>TEST_INDEX_CONTENT</div>} />
          <Route component={NotFound} />
        </Switch>
      </MemoryRouter>
    );
    render(app);
    expect(screen.getByRole('heading')).toHaveTextContent(/not found/i);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/go back/i);
    fireEvent.click(button);
    await screen.findByText('TEST_INDEX_CONTENT');
  });
});
