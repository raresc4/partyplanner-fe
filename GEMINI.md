# PartyPlanner Frontend (frontend4)

A modern React-based web application designed to help users organize and manage their parties efficiently.

## Project Overview

- **Purpose:** A collaborative tool for party planning, allowing users to create events, manage tasks, and track party details.
- **Main Technologies:**
    - **UI Framework:** [React](https://reactjs.org/) (v18) bootstrapped with Create React App.
    - **State Management & Data Fetching:** [@tanstack/react-query](https://tanstack.com/query/latest) for server state management.
    - **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS and [Lucide React](https://lucide.dev/) for iconography.
    - **Routing:** [React Router](https://reactrouter.com/) (v6).
    - **API Interaction:** Custom fetch wrappers in the `src/Actions` directory, utilizing environment variables for backend communication.
    - **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/) for real-time user feedback.

## Architecture

- **`src/Actions/`**: Contains asynchronous logic for API calls (e.g., `event.js`, `user.js`). It handles authentication headers and error management.
- **`src/Components/`**: Reusable UI elements such as `Navbar`, `Footer`, and modals like `TaskModal` or `ChangePasswordModal`.
- **`src/Pages/`**: Top-level components representing application views (e.g., `LoginPage`, `MainPage`, `EventPage`, `ProfilePage`).
- **`src/Layouts/`**: Layout wrappers like `BaseLayout` to maintain consistent structure across pages.
- **`src/styles/`**: Global styles and component-specific CSS (e.g., `datepicker.css`).
- **`App.js`**: Orchestrates routing, global providers (QueryClient, BrowserRouter), and authenticated route protection.

## Building and Running

### Prerequisites
- Node.js (version 14+ recommended)
- npm (comes with Node.js)

### Environment Variables
Create a `.env` file in the root directory and define the backend API URL:
```env
REACT_APP_API_URL=http://your-api-url.com
```

### Local Development
```bash
# Install dependencies
npm install

# Start the development server
npm start
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### Testing
```bash
# Run tests in watch mode
npm test
```

### Production Build
```bash
# Generate a production-ready build in the /build folder
npm run build
```

### Docker
A `Dockerfile` is provided for containerized environments:
```bash
# Build the image
docker build -t partyplanner-frontend .

# Run the container
docker run -p 3000:3000 partyplanner-frontend
```
*Note: The current Dockerfile runs the development server. For production, consider multi-stage builds to serve the static files.*

## Development Conventions

- **Component Style**: Prefer functional components with React Hooks.
- **Data Fetching**: Use `React Query` for all server-side data operations to leverage caching and synchronization.
- **Styling**: Use Tailwind CSS utility classes directly in JSX. Avoid writing custom CSS unless necessary for third-party library overrides.
- **API Logic**: Keep API interaction logic within `src/Actions`. Use the `getHeader()` utility for authenticated requests.
- **Error Handling**: Use `react-toastify` to display errors and success messages to the user.
- **File Naming**: Use PascalCase for components/pages (`Navbar.jsx`) and camelCase for actions/utilities (`event.js`).
