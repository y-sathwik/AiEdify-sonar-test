import React from 'react'
import { Clock } from 'lucide-react'
import { ContentList, SectionTitle } from './section-components'
import { cleanContent, extractSection } from '../utils/content-extraction'

interface StarterActivityProps {
  content: string
}

/**
 * Component for rendering the starter activity section in lesson planner
 */
const StarterActivity: React.FC<StarterActivityProps> = ({ content }) => {
  const starterSection = extractSection(content, 'Starter Activity', 'Main Activities')

  // Extract duration from heading
  const durationRegex = /Starter Activity \((\d+) minutes\)/
  const durationRegexAlt = /starter activity \((\d+) minutes\)/
  const durationMatch = durationRegex.exec(starterSection) || durationRegexAlt.exec(starterSection)
  const duration = durationMatch ? durationMatch[1] : null

  // Extract materials and clean content
  const materialsRegex = /Materials:([\s\S]*?)(?=Instructions:|$)/
  const materialsRegexAlt = /materials:([\s\S]*?)(?=instructions:|$)/
  const materialsMatch =
    materialsRegex.exec(starterSection) || materialsRegexAlt.exec(starterSection)
  const materials = materialsMatch ? cleanContent(materialsMatch[1]) : []

  // Extract instructions and clean content
  const instructionsRegex = /Instructions:([\s\S]*?)(?=Materials:|$)/
  const instructionsRegexAlt = /instructions:([\s\S]*?)(?=materials:|$)/
  const instructionsMatch =
    instructionsRegex.exec(starterSection) || instructionsRegexAlt.exec(starterSection)
  const instructions = instructionsMatch ? cleanContent(instructionsMatch[1]) : []

  // Extract description and process content
  const descriptionText = starterSection
    .replace(/Starter Activity \(\d+ minutes\)|starter activity \(\d+ minutes\)/g, '')
    .replace(/Materials:[\s\S]*?(?=Instructions:|$)/g, '')
    .replace(/Instructions:[\s\S]*?(?=Materials:|$)/g, '')
    .replace(/materials:[\s\S]*?(?=instructions:|$)/g, '')
    .replace(/instructions:[\s\S]*?(?=materials:|$)/g, '')
    .trim()

  // Clean description content
  const description = cleanContent(descriptionText)

  return (
    <div>
      {duration && (
        <div className="mb-3 flex items-center">
          <Clock className="text-primary mr-2 h-4 w-4" />
          <span className="text-sm font-medium text-gray-600">{duration} minutes</span>
        </div>
      )}

      {description.length > 0 && (
        <div className="prose-sm mb-4">
          <ContentList items={description} />
        </div>
      )}

      {materials.length > 0 && (
        <div className="bg-muted/20 mb-4 rounded-md p-3">
          <SectionTitle>Materials</SectionTitle>
          <ContentList items={materials} />
        </div>
      )}

      {instructions.length > 0 && (
        <div className="mb-3">
          <SectionTitle>Instructions</SectionTitle>
          <ContentList items={instructions} />
        </div>
      )}
    </div>
  )
}

export default StarterActivity
