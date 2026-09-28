import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getUsers, type User } from '../api/users'

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()

  useEffect(() => {
    const controller = new AbortController()
    getUsers(controller.signal)
      .then(setUsers)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unable to load users.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">DIRECTORY</p>
          <h1>People</h1>
        </div>
        <span className="count-label">{loading ? 'Loading' : `${users.length} ${users.length === 1 ? 'person' : 'people'}`}</span>
      </div>

      {location.state?.success && <div className="toast" role="status">{location.state.success}</div>}
      {loading && <div className="loading" role="status"><span className="spinner" />Loading people…</div>}
      {!loading && error && <div className="notice error" role="alert">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <div className="empty-state"><h2>No people yet</h2><p>Add someone to start your directory.</p></div>
      )}
      {!loading && !error && users.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Age</th><th>City</th><th>State</th><th>Pincode</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user.id}>
                <td className="person-name">{user.name}</td><td>{user.age}</td><td>{user.city}</td><td>{user.state}</td><td>{user.pincode}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  )
}