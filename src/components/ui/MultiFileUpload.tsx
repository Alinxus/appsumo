'use client'

import { useState, useRef } from 'react'

interface FileItem {
  file: File;
  id: string;
  preview: string;
}

interface MultiFileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  className?: string;
}

export function MultiFileUpload({
  onFilesChange,
  accept = "image/*",
  label = "Upload images",
  maxSizeMB = 5,
  maxFiles = 5,
  className = ""
}: MultiFileUploadProps) {
  const [fileItems, setFileItems] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateParent = (items: FileItem[]) => {
    onFilesChange(items.map(item => item.file))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length > 0) {
      validateAndAddFiles(selectedFiles)
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateAndAddFiles = (selectedFiles: File[]) => {
    setError(null)
    
    // Check if adding these files would exceed the max limit
    if (fileItems.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`)
      return
    }
    
    const newItems: FileItem[] = []
    
    selectedFiles.forEach(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB.`)
        return
      }
      
      // Check file type
      if (accept !== "*" && !file.type.match(accept.replace(/\*/g, '.*'))) {
        setError(`File ${file.name} has an invalid type. Please upload ${accept.replace('*', '')} files.`)
        return
      }
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const preview = e.target?.result as string
          const fileItem = {
            file,
            id: `${file.name}-${Date.now()}`,
            preview
          }
          
          // Add to state
          setFileItems(prevItems => {
            const updatedItems = [...prevItems, fileItem]
            updateParent(updatedItems)
            return updatedItems
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeFile = (id: string) => {
    setFileItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id)
      updateParent(updatedItems)
      return updatedItems
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      validateAndAddFiles(droppedFiles)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      
      <div 
        className={`border-2 border-dashed rounded-md p-6 ${
          isDragging ? 'border-[#00b289] bg-[#00b28910]' : 'border-gray-300'
        } transition-colors cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop images here, or click to select files
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            {accept} files up to {maxSizeMB}MB ({fileItems.length}/{maxFiles})
          </p>
          
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          multiple
        />
      </div>
      
      {fileItems.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fileItems.map(item => (
            <div key={item.id} className="relative group">
              <img 
                src={item.preview} 
                alt={item.file.name} 
                className="h-24 w-full object-cover rounded border border-gray-200" 
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(item.id)
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-xs truncate mt-1">{item.file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 