/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "@swc/jest",
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  roots: ['./server/', './__tests__/'],
};
