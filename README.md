# Memory Word Boost

This project serves as a prototype for a [subsequent project](https://qsets.sivercone.com/).

## How to run locally

You will need [node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/) and [postgres](https://www.postgresql.org/) installed.

### client (react + next.js)

0. Change directory:
   `cd ./client/`
1. Install dependencies:
   `yarn`
2. Start dev environment:
   `yarn dev`
3. Visit [localhost:3000](http://localhost:3000) to view the application

Note: To run the client independently without the server, please follow these steps:

1. Create a `.env` file in the `./client/` directory.
2. Add the following line to the file: `NEXT_PUBLIC_BACKENDLESS=true`

This will enable the client to operate in a "backendless" mode.

### server (node.js + postgres)

0. Change directory:
   `cd ./server/`
1. Install dependencies:
   `yarn`
2. Start dev environment:
   `yarn dev`

## License

MIT
