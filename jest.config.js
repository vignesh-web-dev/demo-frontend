export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/jest.env.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(png|svg|jpg|jpeg|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.test.{js,jsx}'],
}
