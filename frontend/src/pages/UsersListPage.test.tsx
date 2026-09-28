import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getUsers } from '../api/users'
import UsersListPage from './UsersListPage'

vi.mock('../api/users', () => ({ getUsers: vi.fn() }))

function renderPage() {
  return render(<MemoryRouter><UsersListPage /></MemoryRouter>)
}

describe('UsersListPage', () => {
  beforeEach(() => vi.resetAllMocks())

  it('loads and displays users', async () => {
    vi.mocked(getUsers).mockResolvedValue([{
      id: 1, name: 'Ada Lovelace', age: 36, city: 'London', state: 'Greater London', pincode: '12345',
    }])

    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent('Loading people')
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
  })

  it('shows an empty state when the directory has no users', async () => {
    vi.mocked(getUsers).mockResolvedValue([])

    renderPage()
    expect(await screen.findByText('No people yet')).toBeInTheDocument()
  })

  it('shows an error when the API request fails', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('Service unavailable'))

    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable')
  })
})