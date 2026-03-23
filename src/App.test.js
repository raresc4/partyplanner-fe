import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PartyPlanner text', () => {
  render(<App />);
  const linkElement = screen.getByText(/PartyPlanner/i);
  expect(linkElement).toBeInTheDocument();
});
