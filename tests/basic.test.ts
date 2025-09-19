// basic.test.ts - Crear en la RAÍZ del proyecto (no en carpeta tests)
describe('Joyeria Backend Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test strings', () => {
    expect('hello world').toContain('world')
  })

  it('should test arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    expect(numbers).toHaveLength(5)
    expect(numbers).toContain(3)
  })

  it('should test objects', () => {
    const user = {
      name: 'Juan',
      email: 'juan@test.com',
      age: 30
    }
    
    expect(user).toHaveProperty('name')
    expect(user.name).toBe('Juan')
    expect(user.age).toBeGreaterThan(18)
  })

  it('should test promises', async () => {
    const promise = Promise.resolve('success')
    await expect(promise).resolves.toBe('success')
  })
})