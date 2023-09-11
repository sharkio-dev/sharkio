## 🛠 Tech Stack

- **General:**
  - Node.js: Serves as the runtime environment for the backend services. It allows the Sharkio project to execute JavaScript server-side, enabling functionalities like proxying requests, data processing, and more.

  - TypeScript: Enhances the codebase with static typing. This ensures better code quality, easier debugging, and improved developer experience within the Sharkio project.

  - Axios: Used to make HTTP requests, likely for fetching data, interacting with APIs, or communicating between different parts of the project.

  - Yargs: Facilitates the creation of the Sharkio CLI (Command Line Interface). This allows users to interact with Sharkio through the command line, executing various commands and configurations.

  - Nodemon: Used during development to automatically restart the server whenever code changes are detected. This speeds up the development process by providing instant feedback.

- **Traffic Dashboard (Frontend):**
  - React: Powers the user interface of the Traffic Dashboard, allowing users to interactively view and analyze the traffic data captured by Sharkio.

  - Vite: Speeds up the development and build process for the frontend, ensuring fast reloads and optimized production builds.

  - @mui/material: Provides pre-designed UI components for the dashboard, ensuring a consistent and modern look and feel.

  - @emotion/react & @emotion/styled: Used for styling the dashboard components, allowing for dynamic and responsive designs.

  - Zustand: Manages the state of the dashboard application, ensuring data consistency and reactivity as users interact with the interface.

  - React Router Dom: Manages navigation within the dashboard, allowing users to switch between different views or pages.

  - Swagger UI React: Displays API documentation within the dashboard, providing users with detailed information about available endpoints and their functionalities.

  - Supabase: Might be used for user authentication and data storage for the dashboard, ensuring secure access and persistent data.

- **Traffic Sniffer (Backend):**
  - Express: Serves as the backbone of the backend services, handling incoming requests, routing, and delivering responses.

  - CORS: Ensures that the backend services can securely handle requests from different origins, especially important for a tool like Sharkio that might be dealing with various APIs.

  - Cookie-Parser: Processes cookies from incoming requests, which can be essential for session management or user preferences.

  - Express-Http-Proxy: Allows the backend to act as a proxy, which is core to Sharkio's functionality of recording and analyzing API requests.

  - Winston: Provides logging capabilities, ensuring that all events, errors, and significant actions within the backend are properly recorded.

  - Zod: Validates and parses incoming data, ensuring that the backend processes only valid and expected data formats.

