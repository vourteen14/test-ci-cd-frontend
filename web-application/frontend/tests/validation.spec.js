describe('Frontend Business Logic', () => {
  const validateUserForm = (userData) => {
    const errors = []
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    }
    
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Valid email is required')
    }
    
    if (userData.age === undefined || userData.age === null || userData.age < 0 || userData.age > 120) {
      errors.push('Age must be between 0 and 120')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const formatUserData = (user) => {
    return {
      ...user,
      displayName: `${user.name} (${user.age})`,
      emailDomain: user.email.split('@')[1],
      isAdult: user.age >= 18
    }
  }

  test('validateUserForm works correctly', () => {
    const validUser = { name: 'John Doe', email: 'john@example.com', age: 25 }
    const validResult = validateUserForm(validUser)
    expect(validResult.isValid).toBe(true)
    expect(validResult.errors).toHaveLength(0)

    const invalidUser = { name: 'J', email: 'invalid', age: -5 }
    const invalidResult = validateUserForm(invalidUser)
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.errors).toHaveLength(3)
  })

  test('formatUserData adds computed properties', () => {
    const user = { 
      id: 1, 
      name: 'Jane Doe', 
      email: 'jane@example.com', 
      age: 25 
    }
    
    const formatted = formatUserData(user)
    
    expect(formatted.displayName).toBe('Jane Doe (25)')
    expect(formatted.emailDomain).toBe('example.com')
    expect(formatted.isAdult).toBe(true)
  })

  test('age validation edge cases', () => {
    const minorUser = { name: 'Minor', email: 'minor@example.com', age: 17 }
    const formatted = formatUserData(minorUser)
    expect(formatted.isAdult).toBe(false)

    const zeroAge = { name: 'Baby', email: 'baby@example.com', age: 0 }
    const validation = validateUserForm(zeroAge)
    expect(validation.isValid).toBe(true)
  })
})