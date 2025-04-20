import React from "react"
import { useState, useEffect } from "react"
import { Check, X, Plus, User, UserPlus, Loader2 } from "lucide-react"
import { mockUsers } from "../lib/mock-data"
import axios from "axios"

export function ManageUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUsers, setNewUsers] = useState([{ name: "", email: "", id: Date.now() }])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // In a real app, replace with your API endpoint
      // const response = await axios.get('/api/users')
      // setUsers(response.data)

      // For demo purposes, using mock data with a delay
      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
    }
  }

  const togglePermission = async (userId) => {
    setLoading(true)
    try {
      const userToUpdate = users.find(u => u.id === userId)
      if (!userToUpdate) return

      const updatedUser = { ...userToUpdate, canUpload: !userToUpdate.canUpload }

      // In a real app, this would update the backend
      // await axios.patch(`/api/users/${userId}`, { canUpload: !userToUpdate.canUpload })

      // Update local state to reflect changes
      setUsers(users.map(user => user.id === userId ? updatedUser : user))

      // Simple notification
      const action = updatedUser.canUpload ? "granted to" : "revoked from"
      console.log(`Upload permission ${action} ${updatedUser.name}`)
    } catch (error) {
      console.error("Error updating user permission:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addUserField = () => {
    setNewUsers([...newUsers, { name: "", email: "", id: Date.now() }])
  }

  const updateNewUserField = (id, field, value) => {
    setNewUsers(newUsers.map(user =>
      user.id === id ? { ...user, [field]: value } : user
    ))
  }

  const removeUserField = (id) => {
    if (newUsers.length > 1) {
      setNewUsers(newUsers.filter(user => user.id !== id))
    }
  }

  const handleAddUsers = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out incomplete entries
      const validUsers = newUsers.filter(user => user.name && user.email)

      if (validUsers.length === 0) {
        alert("Please enter at least one complete user")
        setLoading(false)
        return
      }

      // In a real app, this would send data to the backend
      // const response = await axios.post('/api/users', validUsers)

      // For demo purposes
      const newUsersList = validUsers.map(user => ({
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        canUpload: false
      }))

      setUsers([...users, ...newUsersList])
      setShowAddForm(false)
      setNewUsers([{ name: "", email: "", id: Date.now() }])

      alert(`${validUsers.length} new user${validUsers.length > 1 ? 's' : ''} added successfully`)
    } catch (error) {
      console.error("Error adding users:", error)
      alert("Failed to add users")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>

        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <Plus size={18} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Users</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUsers}>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {newUsers.map((user, index) => (
                  <div key={user.id} className="border rounded-md p-4 relative">
                    {newUsers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUserField(user.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={user.name}
                        onChange={(e) => updateNewUserField(user.id, "name", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={user.email}
                        onChange={(e) => updateNewUserField(user.id, "email", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addUserField}
                className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
              >
                <UserPlus size={18} className="mr-2" />
                Add Another User
              </button>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Add Users'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && !showAddForm && (
        <div className="flex justify-center my-12">
          <Loader2 size={36} className="animate-spin text-gray-500" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full p-3 mr-4">
                    <User size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className={`flex items-center ${user.canUpload ? "text-green-500" : "text-red-500"}`}>
                  {user.canUpload ? <Check size={20} /> : <X size={20} />}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${user.canUpload ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  <span className="text-sm text-gray-600">
                    {user.canUpload ? "Can upload photos" : "Cannot upload photos"}
                  </span>
                </div>

                <button
                  onClick={() => togglePermission(user.id)}
                  className={`px-3 py-1 rounded-md text-sm ${user.canUpload
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                >
                  {user.canUpload ? "Revoke Access" : "Grant Access"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  )
}
