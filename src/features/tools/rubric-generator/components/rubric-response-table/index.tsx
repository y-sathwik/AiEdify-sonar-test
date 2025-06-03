import React from 'react'
import { RubricResponse } from '../../schema/response-schema'
import { BookOpen, Award, User, Tag, School } from 'lucide-react'

// Metadata card component
interface MetadataCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

const MetadataCard = ({ icon, label, value }: MetadataCardProps) => {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-100 bg-white p-4 text-center shadow-sm">
      <div className="bg-primary/10 text-primary mb-3 rounded-full p-2">{icon}</div>
      <div className="mb-1 text-sm text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  )
}

// Metadata display component with cards
interface MetadataDisplayProps {
  rubricData: RubricResponse
}

const MetadataDisplay = ({ rubricData }: MetadataDisplayProps) => {
  if (!rubricData?.data?.metadata) {
    return null
  }

  const { metadata } = rubricData.data

  // Debug log to see what values we're actually getting
  console.log('Rubric metadata:', metadata)
  console.log('Assessment Type:', metadata?.assessmentType)
  console.log('Assessor:', metadata?.assessor)

  // Determine display assessor based on assessmentType directly
  let displayAssessor
  if (metadata?.assessmentType?.toLowerCase().includes('peer')) {
    displayAssessor = 'Peer'
  } else if (metadata?.assessmentType?.toLowerCase().includes('self')) {
    displayAssessor = 'Self'
  } else {
    displayAssessor = 'Class Teacher'
  }

  console.log('Display Assessor:', displayAssessor)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rubric Information</h3>

      {/* First row: Subject and Topic */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <MetadataCard
          icon={<Tag className="h-5 w-5" />}
          label="Topic"
          value={metadata.topic ?? ''}
        />
        <MetadataCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Subject"
          value={metadata.subject ?? ''}
        />
      </div>

      {/* Second row: Assessment Type, Assessor, Key Stage */}
      <div className="grid grid-cols-3 gap-4">
        <MetadataCard
          icon={<Award className="h-5 w-5" />}
          label="Assessment Type"
          value={metadata.assessmentType ?? ''}
        />
        <MetadataCard
          icon={<User className="h-5 w-5" />}
          label="Assessor"
          value={displayAssessor}
        />
        <MetadataCard
          icon={<School className="h-5 w-5" />}
          label="Key Stage"
          value={`${metadata.keyStage} (Level ${metadata.level})`}
        />
      </div>
    </div>
  )
}

// RubricResponseTable component props
interface RubricResponseTableProps {
  rubricData: RubricResponse
}

export default function RubricResponseTable({ rubricData }: Readonly<RubricResponseTableProps>) {
  if (!rubricData?.data?.rubric?.criteria) {
    return <div>No rubric data available</div>
  }

  // Get the key stage number from the string (e.g., "ks3" -> 3)
  const keyStageNumber = parseInt(
    (rubricData.data.metadata?.keyStage ?? '').replace('ks', '') ?? '0'
  )

  // Define all possible levels with their keys and labels
  const allLevels = [
    // Only include exceptional for Key Stage 5
    { key: 'exceptional', label: 'Exceptional (5)' },
    { key: 'advanced', label: 'Advanced (4)' },
    { key: 'proficient', label: 'Proficient (3)' },
    { key: 'basic', label: 'Basic (2)' },
    { key: 'emerging', label: 'Emerging (1)' },
  ]

  // Filter levels based on key stage
  let visibleLevels

  if (keyStageNumber === 3) {
    // For Key Stage 3: Show emerging, basic, proficient
    visibleLevels = allLevels.filter((level) =>
      ['emerging', 'basic', 'proficient'].includes(level.key)
    )
  } else if (keyStageNumber === 4) {
    // For Key Stage 4: Show emerging, basic, proficient, advanced
    visibleLevels = allLevels.filter((level) =>
      ['emerging', 'basic', 'proficient', 'advanced'].includes(level.key)
    )
  } else if (keyStageNumber === 5) {
    // For Key Stage 5: Show all levels
    visibleLevels = allLevels
  } else {
    // Default case: Show all except exceptional
    visibleLevels = allLevels.filter((level) => level.key !== 'exceptional')
  }

  // Sort levels in descending order (highest level first)
  visibleLevels.sort((a, b) => {
    const scoreA = parseInt(a.label.match(/\d+/)?.[0] || '0')
    const scoreB = parseInt(b.label.match(/\d+/)?.[0] || '0')
    return scoreB - scoreA
  })

  return (
    <div className="space-y-8">
      <MetadataDisplay rubricData={rubricData} />

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-primary/10">
              <th className="text-primary border-r border-b p-3 text-left font-semibold">
                Criterion
              </th>
              {visibleLevels.map((level) => (
                <th
                  key={level.key}
                  className="text-primary border-r border-b p-3 text-left font-semibold"
                >
                  {level.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rubricData.data.rubric.criteria.map((criterion, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border-r border-b p-3 font-semibold">
                  {criterion.name ?? 'Unnamed Criterion'}
                </td>
                {visibleLevels.map((level) => {
                  const levelData = criterion.levels[level.key as keyof typeof criterion.levels]
                  return (
                    <td key={level.key} className="border-r border-b p-3">
                      <div className="space-y-2">
                        {levelData && (
                          <>
                            <div>{levelData.description ?? ''}</div>
                            <div className="text-primary text-sm italic">
                              {levelData.feedback ?? ''}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
