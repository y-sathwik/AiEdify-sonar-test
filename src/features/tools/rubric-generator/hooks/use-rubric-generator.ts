import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, type FormValues } from '../schema/form-schema'
import { RubricResponse } from '../schema/response-schema'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { handleDocumentUpload } from '@/utils/document-parser'

// Default criteria suggestions based on assignment type
const defaultCriteriaSuggestions: Record<string, string[]> = {
  analytical_essay: [
    'Analysis & Critical Thinking',
    'Evidence & Support',
    'Organization & Structure',
    'Writing Style & Clarity',
    'Originality & Insight',
  ],
  debate: [
    'Argument Quality',
    'Evidence & Research',
    'Rebuttal & Response',
    'Presentation Skills',
    'Team Collaboration',
  ],
  research_project: [
    'Research Methodology',
    'Data Analysis',
    'Critical Evaluation',
    'Presentation Quality',
    'Innovation & Originality',
  ],
  presentation: [
    'Content Quality',
    'Delivery & Communication',
    'Visual Aids',
    'Engagement & Interaction',
    'Time Management',
  ],
  other: [
    'Understanding & Knowledge',
    'Application of Skills',
    'Critical Thinking',
    'Communication',
    'Creativity',
  ],
}

export function useRubricGenerator() {
  // Form state
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [rubricData, setRubricData] = useState<RubricResponse | null>(null)
  const [showCustomType, setShowCustomType] = useState<boolean>(false)
  const [criteria, setCriteria] = useState<string[]>([''])
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text')
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('')
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignmentType: '',
      customAssignmentType: '',
      keyStage: '',
      yearGroup: '',
      assessmentType: '',
      topic: '',
      criteria: [''],
      additionalInstructions: '',
      inputMethod: 'text',
      fileUrl: '',
      fileContent: '',
    },
  })

  // Watch for assignment type changes to update criteria suggestions
  const assignmentType = form.watch('assignmentType')

  // Update criteria suggestions when assignment type changes
  useEffect(() => {
    if (assignmentType && defaultCriteriaSuggestions[assignmentType]) {
      setCriteria(defaultCriteriaSuggestions[assignmentType].slice(0, 5))
    }
  }, [assignmentType])

  // Add criteria handling
  const addCriterion = () => {
    if (criteria.length < 6) {
      setCriteria([...criteria, ''])
    }
  }

  const removeCriterion = (index: number) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((_, i) => i !== index))
    }
  }

  const updateCriterion = (index: number, value: string) => {
    const newCriteria = [...criteria]
    newCriteria[index] = value
    setCriteria(newCriteria)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over?.id) {
      const oldIndex = criteria.findIndex((_, i) => `criterion-${i}` === active.id)
      const newIndex = criteria.findIndex((_, i) => `criterion-${i}` === over.id)

      setCriteria(arrayMove(criteria, oldIndex, newIndex))
    }
  }

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadLoading(true)

    try {
      // Create a simulated URL (would be a real URL in production with Supabase)
      const fileUrl = `https://example.com/uploads/${file.name}`
      setUploadedFileUrl(fileUrl)

      // Set the topic automatically from filename
      const topicName = file.name.split('.')[0]
      form.setValue('topic', topicName)

      // Use the unified document parser to extract text from the file
      const { text: extractedText } = await handleDocumentUpload(file)

      // Store the extracted content to use in the prompt
      form.setValue('fileContent', extractedText)

      console.log('Extracted file content:', extractedText.substring(0, 200) + '...')
    } catch (error) {
      console.error('Error uploading and processing file:', error)
      setError('Failed to process the uploaded file. Please try again.')
    } finally {
      setUploadLoading(false)
    }
  }

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)
    setRubricData(null)

    try {
      // Prepare the form data including criteria and file content
      const formData = {
        ...data,
        criteria: criteria.filter((c) => c.trim()),
        fileUrl: uploadedFileUrl,
      }

      console.log('Submitting data to API:', {
        ...formData,
        fileContent: formData.fileContent
          ? `${formData.fileContent.substring(0, 100)}...`
          : '(none)',
      })

      // Call the actual API endpoint
      const response = await fetch('/api/tools/rubric-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate rubric')
      }

      // Parse the response
      const result = await response.json()
      console.log('API response:', result)

      // Set the rubric data from the API response
      setRubricData(result.data)
    } catch (err) {
      console.error('Error generating rubric:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while generating the rubric. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Check if form is valid
  const isFormValid = () => {
    const commonValidation =
      form.getValues('assignmentType') !== '' &&
      form.getValues('keyStage') !== '' &&
      form.getValues('yearGroup') !== '' &&
      form.getValues('assessmentType') !== '' &&
      criteria.every((c) => c.trim() !== '') &&
      isChecked

    return (
      commonValidation &&
      form.getValues('topic') !== '' &&
      (inputMethod === 'text' || (inputMethod === 'file' && uploadedFileUrl !== ''))
    )
  }

  return {
    // Form state
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

    // Handlers
    onSubmit,
    addCriterion,
    removeCriterion,
    updateCriterion,
    handleDragEnd,
    handleFileUpload,
    isFormValid,
  }
}
