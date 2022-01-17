module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/$1"
  }
};
