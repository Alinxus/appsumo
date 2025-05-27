'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*",
  label = "Upload file",
  maxSizeMB = 5,
  className = "",
  buttonText = "Choose file"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndProcessFile(file)
    }
  }

  const validateAndProcessFile = (file: File) => {
    setError(null)
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }
    
    // Check file type
    if (accept !== "*" && !file.type.match(accept.replace(/\*/g, '.*'))) {
      setError(`Invalid file type. Please upload a ${accept.replace('*', '')} file.`)
      return
    }
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
    
    onFileSelect(file)
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
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndProcessFile(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      
      <div 
        className={`border-2 border-dashed rounded-md p-6 ${
          isDragging ? 'border-[#00b289] bg-[#00b28910]' : 'border-gray-300'
        } transition-colors flex flex-col items-center justify-center cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-h-40 object-contain" />
          </div>
        ) : (
          <svg 
            className="w-10 h-10 text-gray-400 mb-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" 
            />
          </svg>
        )}
        
        <button 
          type="button" 
          className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b289]"
        >
          {buttonText}
        </button>
        
        <p className="mt-2 text-xs text-gray-500">
          Drag and drop a file or click to browse
        </p>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
} 