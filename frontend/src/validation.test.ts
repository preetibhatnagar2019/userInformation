import { describe, expect, it } from 'vitest'
import { validateUser } from './validation'
import type { UserForm } from './api/users'

const validForm: UserForm = { name: 'Ada Lovelace', age: '36', city: 'London', state: 'Greater London', pincode: '12345' }

describe('validateUser', () => {
  it('accepts valid user details', () => {
    expect(validateUser(validForm)).toEqual({})
  })

  it('reports required and out-of-range values', () => {
    expect(validateUser({ ...validForm, name: 'A', age: '121', city: '', pincode: '123' })).toEqual({
      name: 'Name must be 2 to 100 characters.',
      age: 'Age must be a whole number from 0 to 120.',
      city: 'City is required.',
      pincode: 'Pincode must be 4 to 10 characters.',
    })
  })

  it('rejects digit-only city and state values but allows mixed text', () => {
    expect(validateUser({ ...validForm, city: '123', state: '456' })).toEqual({
      city: 'City must include at least one letter.',
      state: 'State must include at least one letter.',
    })
    expect(validateUser({ ...validForm, city: 'District 5', state: 'Region 2' })).toEqual({})
  })
})