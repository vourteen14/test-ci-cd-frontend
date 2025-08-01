beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  console.log('Running tests with mock database');
});

afterAll(async () => {
  console.log('Mock tests completed');
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});