import { useRef, useState } from 'react';

export function BackupControls() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    try {
      const stored = localStorage.getItem('birthdays');
      const birthdays = stored ? JSON.parse(stored) : {};
      
      const blob = new Blob([JSON.stringify(birthdays, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `birthday-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
      alert('Failed to create backup. Please try again.');
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      const birthdays = JSON.parse(text);

      // Validate the structure
      const isValid = Object.values(birthdays).every((birthday: any) => 
        typeof birthday === 'object' &&
        'month' in birthday &&
        'day' in birthday
      );

      if (!isValid) {
        throw new Error('Invalid backup file format');
      }

      localStorage.setItem('birthdays', JSON.stringify(birthdays));
      window.location.reload();
    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Failed to restore backup. Please ensure the file is valid.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  return (
    <div className="mt-8 flex items-center space-x-4 text-sm">
      <button
        onClick={handleDownload}
        className="text-green-600 hover:text-green-700 flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Backup to file
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json"
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border border-dashed px-4 py-2 rounded
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          cursor-pointer transition-colors
        `}
      >
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Restore from backup
        </div>
      </div>
    </div>
  );
}