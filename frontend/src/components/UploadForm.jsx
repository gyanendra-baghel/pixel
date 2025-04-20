import React from "react"

import { useState } from "react"
import { Upload, X, Plus } from "lucide-react"

export function UploadForm({ onUpload }) {
  const [title, setTitle] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [customTag, setCustomTag] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  // Predefined tag options
  const tagOptions = [
    "nature",
    "city",
    "architecture",
    "people",
    "animals",
    "food",
    "travel",
    "landscape",
    "abstract",
    "black and white",
  ]

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag])
      setCustomTag("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!imageFile) {
      alert("Please select an image to upload")
      return
    }

    if (!title) {
      alert("Please enter a title for your image")
      return
    }

    if (selectedTags.length === 0) {
      alert("Please select at least one tag")
      return
    }

    onUpload(title, selectedTags, imageFile)

    // Reset form
    setTitle("")
    setSelectedTags([])
    setImageFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Image Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter a title for your image"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full ${selectedTags.includes(tag)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Add custom tag"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700"
                >
                  <Plus size={18} />
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Selected tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                <Upload size={48} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">Click to upload or drag and drop</p>
                <label className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                  Select Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setPreviewUrl(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <Upload size={18} className="mr-2" />
            Upload Image
          </button>
        </div>
      </form>
    </div>
  )
}
