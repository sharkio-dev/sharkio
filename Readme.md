<p align="center">
  <img align="center" width="10%" src="assets/sharkio-logo.webp" alt="logo"/>
  <h2 align="center">Sharkio</h2>
</p>

## 🐳 What is Sharkio

Sharkio is a development tool for api developers.
It is a proxy that records all the requests that are sent to your servers.
And provides you with a dashboard to analyze all the traffic.
Sharkio also provides the ability to repeat requests.
Generate types for youre favorite language based on real data.

## Help us help you!

<a href="https://www.buymeacoffee.com/sharkio"><img src="https://img.buymeacoffee.com/button-api/?text=Sponsor Sharkio&emoji=💰&slug=sharkio&button_colour=5F7FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" /></a>

## 🗺️ Roadmap

In the roadmap sharkio will support team functions.
Also Sharkio will integrate with ChatGPT in order to allow easy use of api.
Request automation.
Api inconsistency alerting.
Integration to Postman.
Automatic CLI generation for your api with real data.
Request mocking.


## 🔖 Features

|   **Feature Name**    | **Available** |
| :-------------------: | :-----------: |
|    Inspect traffic    |      ✅       |
|        Search         |      ✅       |
|        Filter         |      ✅       |
|    Repeat request     |      ✅       |
| Typescript generator  |      ✅       |
| JSON schema generator |      ✅       |
| Microservice support  |      ✅       |
|     Request mocks     |      ✅       |
|  Open api generator   |      ✅       |
|     Save requests     |      ✅       |
|      Collections      |      ✅       |
|  ChatGPT integration  |               |
|    Share requests     |               |


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


## 🛠️ How to use

- npm install -g @idodav/sharkio@latest
- sharkio dashboard start
- sharkio admin start
- sharkio admin sniffers create --port 5100 --downstreamUrl http://localhost:3000

## 🚀 Getting started

### Running in development

- npm i -g concurrently ts-node

For the backend

- cd into traffic-sniffer.
- npm install
- npm run dev

For the frontend

- cd into traffic-dashboard.
- npm install
- npm run dev

For both:

- npm run dev ( in root directory )

Note:

- Incase you want a dummy server to test sniffing as shown in [visual demonstration of how to use](https://github.com/idodav/sharkio#visual-demonstration-how-to-run-the-application), then run the follwoing command:
- `npm run demo` ( in root directory )

### Running in production - using Docker

Run whole project:

- in root of project, use:
- `docker-compose up`
- NOTE: use ports 5550-5560 as proxies, make sure they are available.

Run backend/frontend only:

- `cd` to relevent folder
- build the Docker image: `npm run docker:build`
- run the app: `npm run docker:run`

## ❓ Setup FAQs:

<details>
  <summary> [1] Pre-commit hook is not installed during normal installation, what should I do? </summary>
    To setup husky [pre-commit hook] manually by running this command: `npm run prepare`
</details>
<details>
  <summary> [2] What does `traffic-dashboard` and `traffic-snifer` directory contain? </summary>
    `traffic-dashboard` is the frontend code || `traffic-snifer` is the backend code
</details>

## 🏗️ Architecture

![image](https://github.com/idodav/sharkio/assets/21335259/6447c0cf-3bd5-4219-90b5-e3e064e4a60e)

## 📸 / 🎥 Screenshots

### Visual Demonstration: How to run the application?

<details>
  <summary>Preview How To Use</summary>
    <img src="assets/gif-demonstration.gif" raw=true alt=GIF Demonstration” style=“margin-right: 10px;”/>
</details>

<details>
  <summary>Preview UI interface</summary>
    <img width="1267" alt="Screenshot 2023-06-21 at 20 01 38" src="https://github.com/Oferlis/sharkio/assets/62609377/9b892d6c-b9b2-47b7-b265-2180ecd427d4">
    <img width="1267" alt="Screenshot 2023-06-26 at 12 32 47" src="https://github.com/Oferlis/sharkio/assets/62609377/8832a940-5ed4-4eb8-ac61-795d76a91790">
</details>

## ⚡ Social links

- ProductHunt page: https://www.producthunt.com/posts/sharkio **Launch is coming soon!**
- Discord server: [https://discord.gg/fXuMxD23](https://discord.gg/GUXywqVn9)

## 👩🏻‍💻 Want to contribute?

- Fork the repo, clone it to your local environment and start exploring the code.
- Look for an issue, preferably from the next milestone list.
- Ask to be assigned to the issue.
- Got stuck? need an advice? find us in the Discord server.
- Found a bug? 🐛 please open an issue.

## 🤝 Acknowledgement

- [Readme generator - readme.so](https://readme.so)

## 🏆 Contributors

Appreciating all our fellow contributors:

<a href = "https://github.com/idodav/sharkio/graphs/contributors">
  <img src = "https://contrib.rocks/image?repo=idodav/sharkio"/>
</a>
