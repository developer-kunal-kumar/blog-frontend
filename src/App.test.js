import { render, screen } from '@testing-library/react';
import App from './App';

test('renders blog app', () => {
  render(<App />);
  const linkElement = screen.getByText(/BlogApp/i);
  expect(linkElement).toBeInTheDocument();
});
