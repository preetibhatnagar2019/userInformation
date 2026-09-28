import type { UserForm } from './api/users'

export type UserField = keyof UserForm
export type UserErrors = Partial<Record<UserField, string>>

export function validateUser(form: UserForm): UserErrors {
  const errors: UserErrors = {}
  const name = form.name.trim()
  const age = form.age.trim()
  const pincode = form.pincode.trim()

  if (!name) errors.name = 'Name is required.'
  else if (name.length < 2 || name.length > 100) errors.name = 'Name must be 2 to 100 characters.'
  if (!age) errors.age = 'Age is required.'
  else if (!Number.isInteger(Number(age)) || Number(age) < 0 || Number(age) > 120) {
    errors.age = 'Age must be a whole number from 0 to 120.'
  }
  if (!form.city.trim()) errors.city = 'City is required.'
  else if (!/\p{L}/u.test(form.city)) errors.city = 'City must include at least one letter.'
  if (!form.state.trim()) errors.state = 'State is required.'
  else if (!/\p{L}/u.test(form.state)) errors.state = 'State must include at least one letter.'
  if (pincode.length < 4 || pincode.length > 10) errors.pincode = 'Pincode must be 4 to 10 characters.'
  return errors
}