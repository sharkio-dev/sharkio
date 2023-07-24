const concurrently = require('concurrently');
const { result } = concurrently(
  [
    'npm run build:dashboard',
    'npm run build:sniffer',
  ],
  {
    killOthers: ['failure'],
  }
);
result.then(() => console.log("build success"), () => console.log("build failed"));