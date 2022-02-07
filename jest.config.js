module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/$1"
  },
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"]
};
