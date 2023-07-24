const concurrently = require('concurrently');
const { result } = concurrently(
  [
    'npm run dashboard',
    'npm run sniffer',
  ],
  {
    killOthers: ['failure'],
  }
);
result.then(() => console.log("build success"), () => console.log("build failed"));