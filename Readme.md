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
