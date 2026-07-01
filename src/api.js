import { toast } from 'react-toastify'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleResponse(res, silent = false) {
  let data = {}
  try {
    data = await res.json().catch(() => ({}))
  } catch (e) {
    data = {}
  }

  if (!res.ok) {
    if (!silent) toast.error(data?.message || `Request failed (${res.status})`)
    return { ok: false, status: res.status, data }
  }

  if (!silent && data && data.message) {
    toast.success(data.message)
  }

  return { ok: true, status: res.status, data }
}

export async function post(path, body, { silent = false } = {}) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    return await handleResponse(res, silent)
  } catch (err) {
    if (!silent) toast.error(err?.message || 'Network error')
    return { ok: false, status: 0, data: { message: err?.message || 'Network error' } }
  }
}

export async function get(path, { silent = false } = {}) {
  try {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { headers })
    return await handleResponse(res, silent)
  } catch (err) {
    if (!silent) toast.error(err?.message || 'Network error')
    return { ok: false, status: 0, data: { message: err?.message || 'Network error' } }
  }
}

export default { API, post, get }
