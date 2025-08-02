describe('Utility Functions', () => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID')
  }

  const buildApiUrl = (endpoint) => {
    const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000'
    return `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  }

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
    
    debouncedIncrement()
    debouncedIncrement()
    debouncedIncrement()
    
    setTimeout(() => {
      expect(counter).toBe(1)
      done()
    }, 150)
  })
})