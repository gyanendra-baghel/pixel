import React, { use } from "react"
import { useState, useEffect } from "react"
import { Check, X, ChevronDown, Mail, Filter, Loader2, Search, RefreshCw, Trash2, AlertTriangle } from "lucide-react"
import axiosInstance from "../utils/api"
import { useParams } from "react-router-dom"

export function ManageUsers() {
  const { galleryId } = useParams();
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showBulkAddForm, setShowBulkAddForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [bulkEmails, setBulkEmails] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [addedUsers, setAddedUsers] = useState([])
  const [showAddedUsers, setShowAddedUsers] = useState(false)
  const [filterAccess, setFilterAccess] = useState("all") // "all", "canUpload", "cannotUpload"
  const [sortColumn, setSortColumn] = useState("email")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    if (!galleryId) return;
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/gallery/access/users/' + galleryId)
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
    }
  }

  const togglePermission = async (email) => {
    setLoading(true)
    try {
      const userToUpdate = users.find(u => u.email === email)
      if (!userToUpdate) return

      const updatedUser = { ...userToUpdate, canUpload: !userToUpdate.canUpload }

      // Update on the backend
      const response = await axiosInstance.patch(`/api/gallery/access/upload`, { email, galleryId, canUpload: !userToUpdate.canUpload })
      console.log("Response:", response.data)

      // Update local state to reflect changes
      setUsers(users.map(user => user.id === userId ? updatedUser : user))

      // Simple notification
      const action = updatedUser.canUpload ? "granted to" : "revoked from"
      console.log(`Upload permission ${action} ${updatedUser.email}`)
    } catch (error) {
      console.error("Error updating user permission:", error)
    } finally {
      setLoading(false)
    }
  }

  const bulkUpdatePermissions = async (selectedUsers, setPermission) => {
    setLoading(true)
    try {
      const updatedUsers = users.map(user => {
        if (selectedUsers.includes(user.id)) {
          return { ...user, canUpload: setPermission }
        }
        return user
      })

      // Update backend
      await axiosInstance.patch('/api/gallery/access/bulk', { userIds: selectedUsers, canUpload: setPermission })

      setUsers(updatedUsers)
      setSelectedUsers([])
    } catch (error) {
      console.error("Error updating user permissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const initiateDeleteUser = (user) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const deleteUser = async () => {
    if (!userToDelete) return

    setLoading(true)
    try {
      // Delete from the backend
      const response = await axiosInstance.delete(`/api/gallery/access/revoke/${userToDelete.id}`)

      console.log("Delete response:", response.data)

      // Update local state
      setUsers(users.filter(user => user.id !== userToDelete.id))
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setLoading(false)
    }
  }

  const initiateBulkDelete = () => {
    if (selectedUsers.length > 0) {
      setShowBulkDeleteConfirm(true)
    }
  }

  const bulkDeleteUsers = async () => {
    setLoading(true)
    try {
      // Delete from the backend
      await axiosInstance.delete('/api/gallery/access/bulk', { data: { userIds: selectedUsers } })

      // Update local state
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      setShowBulkDeleteConfirm(false)
    } catch (error) {
      console.error("Error deleting users:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleBulkAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAddedUsers([])

    try {
      // Extract email addresses
      const emailList = bulkEmails
        .split(/[\n,;]/)
        .map(email => email.trim())
        .filter(email => email && validateEmail(email))

      if (emailList.length === 0) {
        alert("Please enter at least one valid email address")
        setLoading(false)
        return
      }

      // Check for duplicates in current users
      const existingEmails = users.map(user => user.email.toLowerCase())

      // Create new users list
      const bulkUsersList = emailList.map(email => {
        const isExisting = existingEmails.includes(email.toLowerCase())
        return {
          email,
          id: Math.random().toString(36).substr(2, 9),
          canUpload: false,
          canView: true,
          status: isExisting ? "duplicate" : "added"
        }
      })

      // Add only non-duplicate users to backend
      const newUsers = bulkUsersList.filter(user => user.status === "added")

      if (newUsers.length > 0) {
        // Call backend to add users
        const response = await axiosInstance.post('/api/gallery/access/grant/bulk', {
          galleryId,
          userEmails: newUsers.map(user => user.email)
        })

        console.log("Bulk add response:", response.data)

        setUsers([...users, ...newUsers])
      }

      // Store all processed users for display
      setAddedUsers(bulkUsersList)
      setShowAddedUsers(true)
      setBulkEmails("")
      setShowBulkAddForm(false)

    } catch (error) {
      console.error("Error adding bulk users:", error)
      alert("Failed to add users")
    } finally {
      setLoading(false)
    }
  }

  const closeBulkAddResults = () => {
    setShowAddedUsers(false)
    setAddedUsers([])
  }

  // Table sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter users based on search term and access filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterAccess === "all") return matchesSearch
    if (filterAccess === "canUpload") return matchesSearch && user.canUpload
    if (filterAccess === "cannotUpload") return matchesSearch && !user.canUpload

    return matchesSearch
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0

    if (sortColumn === "email") {
      comparison = a.email.localeCompare(b.email)
    } else if (sortColumn === "access") {
      comparison = (a.canUpload === b.canUpload) ? 0 : a.canUpload ? 1 : -1
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // User selection for bulk actions
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(sortedUsers.map(user => user.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
      setSelectAll(false)
    } else {
      setSelectedUsers([...selectedUsers, userId])
      if (selectedUsers.length + 1 === sortedUsers.length) {
        setSelectAll(true)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Gallery Access</h2>

        <div className="mt-3 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowBulkAddForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <Mail size={18} className="mr-2" />
            Add Users
          </button>

          <button
            onClick={fetchUsers}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center sm:w-64">
          <div className="relative w-full">
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Filter size={18} />
            </div>
            <select
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none"
            >
              <option value="all">All Users</option>
              <option value="canUpload">Can Upload</option>
              <option value="cannotUpload">Cannot Upload</option>
            </select>
            <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk actions for selected users */}
      {selectedUsers.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap items-center gap-4">
          <span className="text-gray-700 font-medium">{selectedUsers.length} user(s) selected</span>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => bulkUpdatePermissions(selectedUsers, true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
            >
              <Check size={18} className="mr-2" />
              Grant Upload Access
            </button>
            <button
              onClick={() => bulkUpdatePermissions(selectedUsers, false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
            >
              <X size={18} className="mr-2" />
              Revoke Upload Access
            </button>
            <button
              onClick={initiateBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 size={18} className="mr-2" />
              Delete Users
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                      {sortColumn === "email" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("access")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Upload Access
                    {sortColumn === "access" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${user.canUpload ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      <span className={`text-sm ${user.canUpload ? "text-green-700" : "text-red-700"}`}>
                        {user.canUpload ? "Granted" : "Denied"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => togglePermission(user.email)}
                        className={`px-3 py-1 rounded-md text-sm ${user.canUpload
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                      >
                        {user.canUpload ? "Revoke" : "Grant"}
                      </button>
                      <button
                        onClick={() => initiateDeleteUser(user)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center my-12">
            <Loader2 size={36} className="animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* Bulk Add Form Modal */}
      {showBulkAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Multiple Users</h3>
              <button onClick={() => setShowBulkAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBulkAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Addresses (one per line, or separated by commas)
                  </label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 h-40"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBulkAddForm(false)}
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

      {/* Added Users Results Modal */}
      {showAddedUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Bulk Add Results</h3>
              <button onClick={closeBulkAddResults} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">
                {addedUsers.filter(u => u.status === "added").length} user(s) added successfully.
                {addedUsers.filter(u => u.status === "duplicate").length > 0 ?
                  ` ${addedUsers.filter(u => u.status === "duplicate").length} duplicate(s) found.` :
                  ""}
              </p>

              {addedUsers.map((user) => (
                <div key={user.id} className="border rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  {user.status === "added" ? (
                    <div className="text-green-500 flex items-center">
                      <Check size={18} className="mr-1" />
                      <span className="text-sm">Added</span>
                    </div>
                  ) : (
                    <div className="text-amber-500 flex items-center">
                      <X size={18} className="mr-1" />
                      <span className="text-sm">Duplicate</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeBulkAddResults}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the following user? This action cannot be undone.
              </p>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">{userToDelete.email}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setUserToDelete(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} className="mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Confirm Bulk Deletion</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>{selectedUsers.length}</strong> user(s)? This action cannot be undone.
              </p>

              <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
                <p className="font-medium mb-2">Selected users:</p>
                <ul className="text-sm text-gray-600">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId)
                    return user ? (
                      <li key={userId} className="mb-1">{user.email}</li>
                    ) : null
                  })}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={bulkDeleteUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} className="mr-2" />
                    Delete Users
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
