describe('API Service Mock Tests', () => {
  const mockAPI = {
    getUsers: jest.fn(() => Promise.resolve({ 
      data: { success: true, data: [] } 
    })),
    getUser: jest.fn((id) => Promise.resolve({ 
      data: { success: true, data: { id, name: 'Test User', email: 'test@example.com', age: 25 } } 
    })),
    createUser: jest.fn((userData) => Promise.resolve({ 
      data: { success: true, data: { id: 1, ...userData } } 
    })),
    updateUser: jest.fn((id, userData) => Promise.resolve({ 
      data: { success: true, data: { id, ...userData } } 
    })),
    deleteUser: jest.fn((id) => Promise.resolve({ 
      data: { success: true, message: 'User deleted successfully' } 
    }))
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('API service has all required methods', () => {
    expect(typeof mockAPI.getUsers).toBe('function')
    expect(typeof mockAPI.getUser).toBe('function')
    expect(typeof mockAPI.createUser).toBe('function')
    expect(typeof mockAPI.updateUser).toBe('function')
    expect(typeof mockAPI.deleteUser).toBe('function')
  })

  test('getUsers returns expected structure', async () => {
    const result = await mockAPI.getUsers()
    
    expect(mockAPI.getUsers).toHaveBeenCalledTimes(1)
    expect(result.data.success).toBe(true)
    expect(Array.isArray(result.data.data)).toBe(true)
  })

  test('getUser returns user data', async () => {
    const userId = 1
    const result = await mockAPI.getUser(userId)
    
    expect(mockAPI.getUser).toHaveBeenCalledWith(userId)
    expect(result.data.success).toBe(true)
    expect(result.data.data.id).toBe(userId)
    expect(result.data.data.name).toBe('Test User')
  })

  test('createUser accepts user data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    }
    
    const result = await mockAPI.createUser(userData)
    
    expect(mockAPI.createUser).toHaveBeenCalledWith(userData)
    expect(result.data.success).toBe(true)
    expect(result.data.data.name).toBe(userData.name)
    expect(result.data.data.email).toBe(userData.email)
    expect(result.data.data.age).toBe(userData.age)
  })

  test('updateUser works correctly', async () => {
    const userId = 1
    const updateData = {
      name: 'Jane Doe Updated',
      email: 'jane.updated@example.com',
      age: 30
    }
    
    const result = await mockAPI.updateUser(userId, updateData)
    
    expect(mockAPI.updateUser).toHaveBeenCalledWith(userId, updateData)
    expect(result.data.success).toBe(true)
    expect(result.data.data.id).toBe(userId)
    expect(result.data.data.name).toBe(updateData.name)
  })

  test('deleteUser works correctly', async () => {
    const userId = 1
    const result = await mockAPI.deleteUser(userId)
    
    expect(mockAPI.deleteUser).toHaveBeenCalledWith(userId)
    expect(result.data.success).toBe(true)
    expect(result.data.message).toBe('User deleted successfully')
  })

  test('API handles multiple users', async () => {
    // Mock multiple users response
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com', age: 25 },
      { id: 2, name: 'User 2', email: 'user2@example.com', age: 30 }
    ]
    
    mockAPI.getUsers.mockResolvedValueOnce({ 
      data: { success: true, data: mockUsers } 
    })
    
    const result = await mockAPI.getUsers()
    
    expect(result.data.data).toHaveLength(2)
    expect(result.data.data[0].name).toBe('User 1')
    expect(result.data.data[1].name).toBe('User 2')
  })

  test('API handles error responses', async () => {
    mockAPI.createUser.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { success: false, error: 'Validation failed' }
      }
    })
    
    try {
      await mockAPI.createUser({ name: '', email: 'invalid', age: -1 })
    } catch (error) {
      expect(error.response.status).toBe(400)
      expect(error.response.data.success).toBe(false)
    }
    
    expect(mockAPI.createUser).toHaveBeenCalledTimes(1)
  })
})