module.exports = {
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest/mocks/file.js",
    "\\.(css|less)$": "<rootDir>/jest/mocks/style.js"
  },
  globals: {
    __DEBUG__: false,
  },
};
