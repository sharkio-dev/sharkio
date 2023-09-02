# Sharkio

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
