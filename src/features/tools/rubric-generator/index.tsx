'use client'

import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Upload } from 'lucide-react'
import { ToolLayout } from '@/components/tools/tool-interface'
import DocumentUpload from '@/components/document-upload'
import SortableCriteria from './components/sortable-criteria'
import RubricResponseTable from './components/rubric-response-table'
import { useRubricGenerator } from './hooks/use-rubric-generator'
import { assignmentTypes, keyStages, assessmentTypes } from './types'

export function RubricGenerator() {
  // Use our custom hook
  const {
    form,
    isChecked,
    setIsChecked,
    isLoading,
    error,
    rubricData,
    showCustomType,
    setShowCustomType,
    criteria,
    inputMethod,
    setInputMethod,
    uploadedFileUrl,
    setUploadedFileUrl,
    uploadLoading,
    selectedFileName,
    setSelectedFileName,
    onSubmit,
    addCriterion,
    removeCriterion,
    updateCriterion,
    handleDragEnd,
    handleFileUpload,
    isFormValid,
  } = useRubricGenerator()

  // Rendered rubric response
  const renderedResponse = rubricData ? <RubricResponseTable rubricData={rubricData} /> : null

  // Input form
  const inputForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Input Method Selection - In a nice card with icons */}
        <div className="mb-6">
          <div className="mb-3 text-lg font-medium">How would you like to create your rubric?</div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 text-left ${inputMethod === 'text' ? 'border-primary bg-primary/5' : 'border-gray-200'} `}
              onClick={() => {
                setInputMethod('text')
                form.setValue('inputMethod', 'text')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setInputMethod('text')
                  form.setValue('inputMethod', 'text')
                }
              }}
              aria-pressed={inputMethod === 'text'}
            >
              <div className="bg-primary/10 mb-2 rounded-full p-2">
                <FileText className="text-primary h-6 w-6" />
              </div>
              <div className="font-medium">Enter Text</div>
              <div className="mt-1 text-center text-sm text-gray-500">
                Create a rubric by providing text information
              </div>
            </button>

            <button
              type="button"
              className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 text-left ${inputMethod === 'file' ? 'border-primary bg-primary/5' : 'border-gray-200'} `}
              onClick={() => {
                setInputMethod('file')
                form.setValue('inputMethod', 'file')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setInputMethod('file')
                  form.setValue('inputMethod', 'file')
                }
              }}
              aria-pressed={inputMethod === 'file'}
            >
              <div className="bg-primary/10 mb-2 rounded-full p-2">
                <Upload className="text-primary h-6 w-6" />
              </div>
              <div className="font-medium">Upload Document</div>
              <div className="mt-1 text-center text-sm text-gray-500">
                Create a rubric based on an uploaded document
              </div>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="space-y-6">
          {/* Text Input Section - Only shown for text input method */}
          {inputMethod === 'text' && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-medium">Topic Information</h3>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the topic for your rubric" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="mt-2 text-xs text-gray-500">
                Provide a clear topic to generate an appropriate rubric.
              </p>
            </div>
          )}

          {/* File Upload Section - Only shown for file input method */}
          {inputMethod === 'file' && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-medium">Document Upload</h3>

              <DocumentUpload
                onFileSelect={(file) => {
                  setSelectedFileName(file.name)
                  handleFileUpload(file)
                }}
                onFileRemove={() => {
                  setUploadedFileUrl('')
                  setSelectedFileName('')
                  form.setValue('topic', '')
                }}
                isLoading={uploadLoading}
                isUploaded={!!uploadedFileUrl}
                uploadedFileName={selectedFileName}
                required={true}
                helpText="The document name will be used as the topic for your rubric. The content will be analyzed to generate appropriate criteria."
              />
            </div>
          )}

          {/* Assignment Details Section */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-medium">Assignment Details</h3>

            {/* Grid layout with 4 columns */}
            <div className="grid grid-cols-4 gap-6">
              {/* First row: Assignment Type (2 cols) and Assessment Type (2 cols) */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="assignmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Type *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setShowCustomType(value === 'other')
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assignmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="assessmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assessment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assessmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Second row: Key Stage (2 cols) and Year Group (2 cols) */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="keyStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Stage *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select key stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {keyStages.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="yearGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Group *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={7}
                          max={13}
                          placeholder="Enter year group (7-13)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom Type conditionally shown - takes full width */}
              {showCustomType && (
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="customAssignmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Type *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter custom assignment type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Assessment Criteria Section */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
            <SortableCriteria
              criteria={criteria}
              addCriterion={addCriterion}
              removeCriterion={removeCriterion}
              updateCriterion={updateCriterion}
              handleDragEnd={handleDragEnd}
            />
          </div>

          {/* Additional Instructions */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter any additional instructions or context for your rubric..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-start space-x-3 p-4">
            <Checkbox
              id="verification"
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
              className="mt-1"
            />
            <label htmlFor="verification" className="text-sm text-gray-600">
              I verify that I have not used any personal data such as student names or private
              information. Instead of names, I have referred to them as student, pupil or similar.
            </label>
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <ToolLayout
      toolName="Rubric Generator"
      inputForm={inputForm}
      onGenerate={form.handleSubmit(onSubmit)}
      isGenerating={isLoading}
      response={renderedResponse}
      disableGenerate={!isFormValid()}
      error={error}
    />
  )
}
