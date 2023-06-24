# Sharkio

## What is Sharkio
Sharkio is a development tool for api developers.
It is a proxy that records all the requests that are sent to your servers.
And provides you with a dashboard to analyze all the traffic.
Sharkio also provides the ability to repeat requests.
Generate types for youre favorite language based on real data.

## Roadmap
In the roadmap sharkio will support team functions.
Also Sharkio will integrate with ChatGPT in order to allow easy use of api.
Request automation.
Api inconsistency alerting.
Integration to Postman.
Automatic CLI generation for your api with real data.
Request mocking.

## Features
|                       | available |
|-----------------------|-----------|
| Inspect traffic       |     V     |
| Search                |     V     |
| Filter                |     V     |
| Repeat request        |     V     |
| Typescript generator  |     V     |
| JSON schema generator |     V     |
| Microservice support  |     V     |
| Open api generator    |           |
| Request mocks         |           |
| ChatGPT integration   |           |
| Save requests         |           |
| Collections           |           |
| Share requests        |           |

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

## Acknowledgement

- [Readme generator - readme.so](https://readme.so)

## How to use

- npm install -g sharkio@latest
- sharkio dashboard start
- sharkio admin start
- sharkio admin sniffers create --port 5100 --downstreamUrl http://localhost:3000

## Getting started

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

## Architecture

![image](https://github.com/idodav/sharkio/assets/21335259/6447c0cf-3bd5-4219-90b5-e3e064e4a60e)

## Screenshots
<img width="1512" alt="Screenshot 2023-06-17 at 23 07 41" src="https://github.com/idodav/sharkio/assets/21335259/f2eb8993-a8a5-4857-9f80-fced384bd4da">
<img width="1512" alt="Screenshot 2023-06-17 at 23 08 54" src="https://github.com/idodav/sharkio/assets/21335259/8d10504f-96cf-4236-8a34-169362113f5c">

