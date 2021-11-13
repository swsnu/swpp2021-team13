import { render, screen } from '@testing-library/react';

import Footer from './Footer';

describe('<Footer />', () => {
  it('includes us, Team 13', () => {
    const app = <Footer />;
    render(app);
    expect(screen.getAllByText(/Team 13/)[0]).toBeInTheDocument();
  });
});
