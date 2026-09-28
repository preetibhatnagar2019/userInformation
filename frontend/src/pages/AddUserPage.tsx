import { useState, type FormEvent } from 'react'
import { useMsal } from '@azure/msal-react'
import { useNavigate } from 'react-router-dom'
import { createUser, type UserForm } from '../api/users'
import { validateUser } from '../validation'

const initialForm: UserForm = { name: '', age: '', city: '', state: '', pincode: '' }
const apiScope = import.meta.env.VITE_ENTRA_API_SCOPE as string | undefined
const authConfigured = Boolean(
  import.meta.env.VITE_ENTRA_CLIENT_ID && import.meta.env.VITE_ENTRA_TENANT_ID && apiScope,
)

export default function AddUserPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<ReturnType<typeof validateUser>>({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const { instance, accounts } = useMsal()
  const navigate = useNavigate()
  const account = accounts[0]

  async function getAccessToken() {
    if (!authConfigured) return undefined
    if (!account) throw new Error('Sign in before adding a person.')
    const result = await instance.acquireTokenSilent({ scopes: [apiScope!], account })
    return result.accessToken
  }

  function change(field: keyof UserForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationErrors = validateUser(form)
    setErrors(validationErrors)
    setSubmitError('')
    if (Object.keys(validationErrors).length) return

    setSaving(true)
    try {
      const accessToken = await getAccessToken()
      await createUser({
        name: form.name.trim(),
        age: Number(form.age),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      }, accessToken)
      navigate('/list', { state: { success: 'Person added successfully.' } })
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Unable to add this person.')
    } finally {
      setSaving(false)
    }
  }

  if (authConfigured && !account) {
    return (
      <section className="page-content">
        <p className="eyebrow">DIRECTORY</p><h1>Add a person</h1>
        <div className="empty-state sign-in"><h2>Sign in required</h2><p>Use your organization account to add people.</p>
          <button className="button primary" onClick={() => instance.loginRedirect({ scopes: [apiScope!] })}>Sign in with Microsoft</button>
        </div>
      </section>
    )
  }

  return (
    <section className="page-content form-page">
      <div className="page-heading"><div><p className="eyebrow">DIRECTORY</p><h1>Add a person</h1></div></div>
      <form className="user-form" onSubmit={submit} noValidate>
        <Field label="Name" name="name" value={form.name} error={errors.name} onChange={change} autoComplete="name" />
        <Field label="Age" name="age" value={form.age} error={errors.age} onChange={change} type="number" min="0" max="120" />
        <Field label="City" name="city" value={form.city} error={errors.city} onChange={change} autoComplete="address-level2" />
        <Field label="State" name="state" value={form.state} error={errors.state} onChange={change} autoComplete="address-level1" />
        <Field label="Pincode" name="pincode" value={form.pincode} error={errors.pincode} onChange={change} autoComplete="postal-code" />
        {submitError && <div className="notice error" role="alert">{submitError}</div>}
        <div className="form-actions"><button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add person'}</button></div>
      </form>
    </section>
  )
}

type FieldProps = {
  label: string
  name: keyof UserForm
  value: string
  error?: string
  onChange: (name: keyof UserForm, value: string) => void
  type?: string
  min?: string
  max?: string
  autoComplete?: string
}

function Field({ label, name, value, error, onChange, ...inputProps }: FieldProps) {
  const id = `user-${name}`
  return (
    <div className="field">
      <label htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>
      <input id={id} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}