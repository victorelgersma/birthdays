import { useRef, useState, useEffect } from 'react'

export function BackupControls() {
  const [isDragging, setIsDragging] = useState(false)
  const [hasBirthdays, setHasBirthdays] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('birthdays')
    const birthdays = stored ? JSON.parse(stored) : {}
    setHasBirthdays(Object.keys(birthdays).length > 0)
  }, [])

  const handleDownload = () => {
    try {
      const stored = localStorage.getItem('birthdays')
      const birthdays = stored ? JSON.parse(stored) : {}

      const blob = new Blob([JSON.stringify(birthdays, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `birthday-backup-${
        new Date().toISOString().split('T')[0]
      }.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download backup:', error)
      alert('Failed to create backup. Please try again.')
    }
  }

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text()
      const birthdays = JSON.parse(text)

      // Validate the structure
      const isValid = Object.values(birthdays).every(
        (birthday: any) =>
          typeof birthday === 'object' &&
          'month' in birthday &&
          'day' in birthday
      )

      if (!isValid) {
        throw new Error('Invalid backup file format')
      }

      localStorage.setItem('birthdays', JSON.stringify(birthdays))

      // Navigate to home page instead of just reloading
      window.location.href = '/'

      // Optional: Show a success message
      alert('Backup restored successfully!')
    } catch (error) {
      console.error('Failed to restore backup:', error)
      alert('Failed to restore backup. Please ensure the file is valid.')
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files[0]
    if (file) {
      await handleFileSelect(file)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileSelect(file)
    }
  }

  return (
    <div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
      {/* Backup button - only show if there are birthdays */}
      {hasBirthdays && (
        <button
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md text-xl font-medium flex flex-col items-center justify-center transition-all transform hover:scale-105 min-h-[150px]"
        >
          <svg
            className="w-16 h-16 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Backup to File
        </button>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json"
        className="hidden"
      />

      {/* Restore button/dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-4 border-dashed rounded-lg shadow-md p-6
          flex flex-col items-center justify-center
          min-h-[150px]
          cursor-pointer transition-all transform hover:scale-105
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-300'
          }
        `}
      >
        <svg
          className="w-16 h-16 mb-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <div className="text-xl font-medium text-gray-700">
          Restore from Backup
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Click or drag file here
        </div>
      </div>
    </div>
  )
}
