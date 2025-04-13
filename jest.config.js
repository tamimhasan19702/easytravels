/** @format */

module.exports = {
  testEnvironment: "jsdom", // Simulates a browser environment for React testing
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Setup file for custom matchers
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock image imports
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JS/JSX files with babel-jest
  },
};
