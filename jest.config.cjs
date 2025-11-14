module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^uuid$": require.resolve("uuid"),
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
};
