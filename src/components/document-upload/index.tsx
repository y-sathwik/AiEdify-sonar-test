'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Loader2, CheckCircle, File, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentUploadProps {
  /** Callback function when a file is selected */
  onFileSelect: (file: File) => void

  /** Callback function when file upload is complete */
  onUploadComplete?: (url: string, fileName: string) => void

  /** Callback function when file is removed */
  onFileRemove?: () => void

  /** Label text for the upload field */
  label?: string

  /** Allowed file types, defaults to PDF and Word documents */
  acceptedTypes?: string

  /** Optional help text to display below the upload area */
  helpText?: string

  /** Optional loading state from parent */
  isLoading?: boolean

  /** Optional success state from parent */
  isUploaded?: boolean

  /** Optional uploaded file name */
  uploadedFileName?: string

  /** Optional success message */
  successMessage?: string

  /** Optional required indicator */
  required?: boolean
}

export default function DocumentUpload({
  onFileSelect,
  onUploadComplete,
  onFileRemove,
  label = 'Upload Document',
  acceptedTypes = '.pdf,.doc,.docx',
  helpText,
  isLoading = false,
  isUploaded = false,
  uploadedFileName = '',
  successMessage = 'Document uploaded successfully',
  required = false,
}: Readonly<DocumentUploadProps>) {
  const [internalLoading, setInternalLoading] = useState(false)
  const [internalUploaded, setInternalUploaded] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState(uploadedFileName)

  // Use either parent or internal state for loading and success
  const uploadLoading = isLoading || internalLoading
  const uploadSuccess = isUploaded || internalUploaded
  const hasFile = uploadSuccess || (!!selectedFileName && !uploadLoading)

  // Determine file type icon
  const getFileIcon = () => {
    const fileName = uploadedFileName || selectedFileName || ''
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    if (extension === 'pdf') {
      return <File className="h-12 w-12 text-red-500" />
    } else if (['doc', 'docx'].includes(extension)) {
      return <FileText className="h-12 w-12 text-blue-500" />
    } else {
      return <File className="h-12 w-12 text-gray-500" />
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFileName('')
    setInternalUploaded(false)

    if (onFileRemove) {
      onFileRemove()
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        {!hasFile ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
            <Input
              id="file-upload"
              type="file"
              accept={acceptedTypes}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setInternalLoading(true)
                  setSelectedFileName(file.name)
                  onFileSelect(file)

                  // If no external loading state provided, auto-complete after a delay
                  if (!isLoading && !onUploadComplete) {
                    setTimeout(() => {
                      setInternalLoading(false)
                      setInternalUploaded(true)
                    }, 1000)
                  }
                }
              }}
              className="hidden"
            />
            <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center">
              <Upload className="mb-2 h-10 w-10 text-gray-400" />
              <span className="mb-1 text-sm font-medium">Click to upload</span>
              <span className="text-xs text-gray-500">
                {acceptedTypes === '.pdf,.doc,.docx'
                  ? 'PDF or Word documents only'
                  : 'Supported formats: ' + acceptedTypes}
              </span>
            </label>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {uploadLoading ? (
                  <div className="flex h-12 w-12 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  getFileIcon()
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {uploadedFileName || selectedFileName}
                  </p>
                  {uploadSuccess && (
                    <p className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" /> {successMessage}
                    </p>
                  )}
                  {uploadLoading && <p className="text-xs text-amber-600">Uploading document...</p>}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleRemoveFile}
                disabled={uploadLoading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  )
}
