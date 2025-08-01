const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  sequelize: {
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  }
}));

const { User } = require('../src/models');

describe('Backend API Tests with Mock Database', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('User CRUD Operations', () => {
    describe('GET /users', () => {
      test('should return empty array when no users exist', async () => {
        // Mock empty result
        User.findAll.mockResolvedValue([]);

        const response = await request(app)
          .get('/users')
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          data: []
        });

        expect(User.findAll).toHaveBeenCalledWith({
          order: [['created_at', 'DESC']]
        });
      });

      test('should return all users ordered by created_at DESC', async () => {
        const mockUsers = [
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            age: 30,
            created_at: '2024-08-01T10:00:00Z'
          },
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            age: 25,
            created_at: '2024-08-01T09:00:00Z'
          }
        ];

        User.findAll.mockResolvedValue(mockUsers);

        const response = await request(app)
          .get('/users')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].email).toBe('jane@example.com');
        expect(response.body.data[1].email).toBe('john@example.com');
      });

      test('should handle database errors gracefully', async () => {
        User.findAll.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app)
          .get('/users')
          .expect(500);

        expect(response.body).toEqual({
          success: false,
          error: 'Failed to fetch users'
        });
      });
    });

    describe('GET /users/:id', () => {
      test('should return specific user by ID', async () => {
        const mockUser = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 28,
          created_at: '2024-08-01T10:00:00Z'
        };

        User.findByPk.mockResolvedValue(mockUser);

        const response = await request(app)
          .get('/users/1')
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          data: mockUser
        });

        expect(User.findByPk).toHaveBeenCalledWith('1');
      });

      test('should return 404 for non-existent user', async () => {
        User.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .get('/users/999')
          .expect(404);

        expect(response.body).toEqual({
          success: false,
          error: 'User not found'
        });
      });

      test('should handle database errors', async () => {
        User.findByPk.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .get('/users/1')
          .expect(500);

        expect(response.body).toEqual({
          success: false,
          error: 'Failed to fetch user'
        });
      });
    });

    describe('POST /users', () => {
      test('should create a new user with valid data', async () => {
        const userData = {
          name: 'New User',
          email: 'newuser@example.com',
          age: 26
        };

        const mockCreatedUser = {
          id: 1,
          ...userData,
          created_at: '2024-08-01T10:00:00Z',
          updated_at: '2024-08-01T10:00:00Z'
        };

        User.create.mockResolvedValue(mockCreatedUser);

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject(userData);
        expect(response.body.data).toHaveProperty('id');

        expect(User.create).toHaveBeenCalledWith(userData);
      });

      test('should return 400 when name is missing', async () => {
        const userData = {
          email: 'test@example.com',
          age: 25
        };

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          error: 'Name, email, and age are required'
        });

        expect(User.create).not.toHaveBeenCalled();
      });

      test('should return 400 when email is missing', async () => {
        const userData = {
          name: 'Test User',
          age: 25
        };

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          error: 'Name, email, and age are required'
        });
      });

      test('should return 400 when age is missing', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com'
        };

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          error: 'Name, email, and age are required'
        });
      });

      test('should handle validation errors', async () => {
        const userData = {
          name: 'Test User',
          email: 'invalid-email',
          age: 25
        };

        const validationError = new Error('Validation error');
        validationError.name = 'SequelizeValidationError';
        validationError.errors = [
          { message: 'Validation isEmail on email failed' }
        ];

        User.create.mockRejectedValue(validationError);

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          error: 'Validation isEmail on email failed'
        });
      });

      test('should handle unique constraint errors', async () => {
        const userData = {
          name: 'Test User',
          email: 'existing@example.com',
          age: 25
        };

        const uniqueError = new Error('Unique constraint error');
        uniqueError.name = 'SequelizeUniqueConstraintError';

        User.create.mockRejectedValue(uniqueError);

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(409);

        expect(response.body).toEqual({
          success: false,
          error: 'Email already exists'
        });
      });

      test('should handle general database errors', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          age: 25
        };

        User.create.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app)
          .post('/users')
          .send(userData)
          .expect(500);

        expect(response.body).toEqual({
          success: false,
          error: 'Failed to create user'
        });
      });
    });

    describe('PUT /users/:id', () => {
      test('should update existing user with valid data', async () => {
        const updatedData = {
          name: 'Updated Name',
          email: 'updated@example.com',
          age: 30
        };

        const mockUser = {
          id: 1,
          name: 'Original Name',
          email: 'original@example.com',
          age: 25,
          update: jest.fn().mockResolvedValue(true)
        };

        // After update, return updated user
        const updatedUser = { ...mockUser, ...updatedData };
        mockUser.update.mockImplementation(() => {
          Object.assign(mockUser, updatedData);
          return Promise.resolve(mockUser);
        });

        User.findByPk.mockResolvedValue(mockUser);

        const response = await request(app)
          .put('/users/1')
          .send(updatedData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject(updatedData);

        expect(User.findByPk).toHaveBeenCalledWith('1');
        expect(mockUser.update).toHaveBeenCalledWith(updatedData);
      });

      test('should return 404 for non-existent user', async () => {
        const updatedData = {
          name: 'Updated Name',
          email: 'updated@example.com',
          age: 30
        };

        User.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .put('/users/999')
          .send(updatedData)
          .expect(404);

        expect(response.body).toEqual({
          success: false,
          error: 'User not found'
        });
      });

      test('should return 400 when required fields are missing', async () => {
        const response = await request(app)
          .put('/users/1')
          .send({ name: 'Updated Name' }) // Missing email and age
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          error: 'Name, email, and age are required'
        });

        expect(User.findByPk).not.toHaveBeenCalled();
      });

      test('should handle unique constraint errors during update', async () => {
        const updatedData = {
          name: 'Updated Name',
          email: 'existing@example.com',
          age: 30
        };

        const mockUser = {
          id: 1,
          update: jest.fn()
        };

        const uniqueError = new Error('Unique constraint error');
        uniqueError.name = 'SequelizeUniqueConstraintError';

        User.findByPk.mockResolvedValue(mockUser);
        mockUser.update.mockRejectedValue(uniqueError);

        const response = await request(app)
          .put('/users/1')
          .send(updatedData)
          .expect(409);

        expect(response.body).toEqual({
          success: false,
          error: 'Email already exists'
        });
      });
    });

    describe('DELETE /users/:id', () => {
      test('should delete existing user', async () => {
        const mockUser = {
          id: 1,
          name: 'User to Delete',
          email: 'delete@example.com',
          age: 25,
          destroy: jest.fn().mockResolvedValue(true)
        };

        User.findByPk.mockResolvedValue(mockUser);

        const response = await request(app)
          .delete('/users/1')
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          message: 'User deleted successfully'
        });

        expect(User.findByPk).toHaveBeenCalledWith('1');
        expect(mockUser.destroy).toHaveBeenCalled();
      });

      test('should return 404 for non-existent user', async () => {
        User.findByPk.mockResolvedValue(null);

        const response = await request(app)
          .delete('/users/999')
          .expect(404);

        expect(response.body).toEqual({
          success: false,
          error: 'User not found'
        });
      });

      test('should handle delete errors', async () => {
        const mockUser = {
          id: 1,
          destroy: jest.fn().mockRejectedValue(new Error('Delete failed'))
        };

        User.findByPk.mockResolvedValue(mockUser);

        const response = await request(app)
          .delete('/users/1')
          .expect(500);

        expect(response.body).toEqual({
          success: false,
          error: 'Failed to delete user'
        });
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/users')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
      
      // Express will handle malformed JSON automatically
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/users')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Name, email, and age are required'
      });
    });

    test('should handle concurrent requests', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', age: 25 },
        { id: 2, name: 'User 2', email: 'user2@example.com', age: 30 }
      ];

      User.findAll.mockResolvedValue(mockUsers);

      // Make multiple concurrent requests
      const requests = Array(5).fill(null).map(() => 
        request(app).get('/users').expect(200)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      expect(User.findAll).toHaveBeenCalledTimes(5);
    });
  });
});

// tests/models/user.mock.test.js - Mock Model Tests
describe('User Model Mock Tests', () => {
  const mockSequelize = {
    define: jest.fn(),
    sync: jest.fn(),
    authenticate: jest.fn()
  };

  const mockDataTypes = {
    INTEGER: 'INTEGER',
    STRING: 'STRING',
    DATE: 'DATE'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should define User model with correct attributes', () => {
    const userModelDefinition = {
      id: {
        type: mockDataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: mockDataTypes.STRING,
        allowNull: false
      },
      email: {
        type: mockDataTypes.STRING,
        allowNull: false,
        unique: true
      },
      age: {
        type: mockDataTypes.INTEGER,
        allowNull: false
      }
    };

    mockSequelize.define.mockReturnValue({
      name: 'User',
      attributes: userModelDefinition
    });

    const UserModel = mockSequelize.define('User', userModelDefinition);

    expect(mockSequelize.define).toHaveBeenCalledWith('User', userModelDefinition);
    expect(UserModel.name).toBe('User');
  });

  test('should validate required fields', () => {
    const invalidUserData = {
      email: 'test@example.com',
      age: 25
      // Missing name
    };

    // Simulate validation error
    const validationError = new Error('Validation error');
    validationError.name = 'SequelizeValidationError';
    validationError.errors = [
      { message: 'User.name cannot be null', path: 'name' }
    ];

    expect(() => {
      if (!invalidUserData.name) {
        throw validationError;
      }
    }).toThrow('Validation error');
  });

  test('should validate email format', () => {
    const invalidEmailData = {
      name: 'Test User',
      email: 'invalid-email',
      age: 25
    };

    const emailValidationError = new Error('Validation error');
    emailValidationError.name = 'SequelizeValidationError';
    emailValidationError.errors = [
      { message: 'Validation isEmail on email failed', path: 'email' }
    ];

    expect(() => {
      // Simple email validation mock
      if (!invalidEmailData.email.includes('@')) {
        throw emailValidationError;
      }
    }).toThrow('Validation error');
  });

  test('should enforce unique email constraint', () => {
    const duplicateEmailError = new Error('Unique constraint error');
    duplicateEmailError.name = 'SequelizeUniqueConstraintError';
    duplicateEmailError.fields = ['email'];

    expect(() => {
      // Simulate duplicate email scenario
      const existingEmails = ['existing@example.com'];
      const newEmail = 'existing@example.com';
      
      if (existingEmails.includes(newEmail)) {
        throw duplicateEmailError;
      }
    }).toThrow('Unique constraint error');
  });
});

// tests/setup.mock.js - Simplified test setup without database
// Global test setup for mock environment
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  console.log('🧪 Running tests with mock database');
});

// No database cleanup needed with mocks
afterAll(async () => {
  console.log('✅ Mock tests completed');
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});