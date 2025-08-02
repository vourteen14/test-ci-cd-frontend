describe('Frontend Business Logic', () => {
  // Simple form validation functions (no Vue dependencies)
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
    // Valid data
    const validUser = { name: 'John Doe', email: 'john@example.com', age: 25 }
    const validResult = validateUserForm(validUser)
    expect(validResult.isValid).toBe(true)
    expect(validResult.errors).toHaveLength(0)

    // Invalid data
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

// tests/utils.spec.js - Test utility functions  
describe('Utility Functions', () => {
  // Date formatting utility
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID')
  }

  // API URL builder
  const buildApiUrl = (endpoint) => {
    const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
    return `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  }

  // Simple debounce function
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  test('formatDate works correctly', () => {
    const testDate = '2024-01-15T10:30:00Z'
    const formatted = formatDate(testDate)
    expect(typeof formatted).toBe('string')
    expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })

  test('buildApiUrl constructs correct URLs', () => {
    process.env.VUE_APP_API_URL = 'http://localhost:3000'
    
    expect(buildApiUrl('/users')).toBe('http://localhost:3000/users')
    expect(buildApiUrl('users')).toBe('http://localhost:3000/users')
    expect(buildApiUrl('/api/v1/users')).toBe('http://localhost:3000/api/v1/users')
  })

  test('debounce function works', (done) => {
    let counter = 0
    const increment = () => counter++
    const debouncedIncrement = debounce(increment, 100)
    
    // Call multiple times quickly
    debouncedIncrement()
    debouncedIncrement()
    debouncedIncrement()
    
    // Should only increment once after delay
    setTimeout(() => {
      expect(counter).toBe(1)
      done()
    }, 150)
  })
})