'use client'

import { useState } from 'react'
import { Category } from '@prisma/client'

interface DeleteCategoryModalProps {
  category: Category
  isOpen: boolean
  onClose: () => void
  onCategoryDeleted: (categoryId: string) => void
}

export function DeleteCategoryModal({
  category,
  isOpen,
  onClose,
  onCategoryDeleted
}: DeleteCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const handleDelete = async () => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete category')
      }
      
      onCategoryDeleted(category.id)
    } catch (error: any) {
      setError(error.message)
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
        </div>
        
        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <p className="text-gray-700">
            Are you sure you want to delete the category <strong>{category.name}</strong>?
          </p>
          
          <p className="mt-2 text-sm text-red-600">
            This action cannot be undone. Categories that have tools associated with them cannot be deleted.
          </p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Category'}
          </button>
        </div>
      </div>
    </div>
  )
} 