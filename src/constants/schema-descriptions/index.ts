import {
  CLARIFY_SCHEMA,
  CHALLENGE_SCHEMA,
} from '../../features/tools/clarify-or-challenge/schema/clarify-challenge'

export const SCHEMA_DESCRIPTIONS = {
  LESSON_PLAN: `
  The response must conform to the following detailed structure:
  {
    overview: {
      subject: string (required),
      topic: string (required),
      yearGroup: string (required),
      duration: number (required, must not exceed 60 minutes),
      learningObjectives: string[] (required, 3-4 clear objectives),
      initialPrompts: string[] (required, 3-4 thought-provoking questions to engage students)
    },
    lessonOptions: [
      {
        optionNumber: number (required, must include options 1, 2, and 3),
        starterActivity: {
          description: string (required),
          duration: number (required, typically 5-10 minutes),
          materials: string[] (required),
          instructions: string[] (required, step-by-step)
        },
        mainActivities: [{
          description: string (required),
          duration: number (required),
          materials: string[] (required),
          instructions: string[] (required, step-by-step),
          differentiation: {
            support: string[] (optional, strategies for lower ability),
            core: string[] (optional, main activities),
            extension: string[] (optional, challenges for higher ability)
          }
        }],
        plenary: {
          description: string (required),
          duration: number (required, typically 5-10 minutes),
          instructions: string[] (required),
          successIndicators: string[] (required, how to assess learning)
        }
      }
    ] (exactly 3 options required),
    reflectionSuggestions: string[] (required, 3-4 strategies for students to evaluate learning),
    differentiationAndSEN: {
      differentiation: {
        support: string[] (optional, general strategies for lower ability),
        core: string[] (optional, main strategies),
        extension: string[] (optional, strategies for higher ability)
      },
      senSupport: {
        visual: string[] (optional, support for visual impairments),
        auditory: string[] (optional, support for hearing impairments),
        cognitive: string[] (optional, support for learning difficulties)
      }
    },
    crossCurricularLinks: string[] (required, at least 3 links to other subjects),
    assessmentQuestions: {
      knowledge: string[] (required, remembering facts),
      comprehension: string[] (required, understanding concepts),
      application: string[] (required, applying knowledge),
      analysis: string[] (required, analyzing information),
      synthesis: string[] (required, creating new ideas),
      evaluation: string[] (required, making judgments)
    },
    additionalNotes: string[] (required, pedagogical tips and advice)
  }`,
  CLARIFY: CLARIFY_SCHEMA,
  CHALLENGE: CHALLENGE_SCHEMA,
  PROMPT_GENERATOR: `
  The response must conform to the following structure:
  {
    refinedPrompts: [
      {
        promptText: string (the refined prompt text),
        explanation: {
          explanation: string (detailed explanation of the prompt's purpose and educational value),
          complexityLevel: {
            refinedLevel: string (one of: "Foundational", "Intermediate", "Advanced", "Expert", "Master"),
            bloomsLevel: string (one of: "Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create")
          },
          focusAreas: string[] (array of specific learning focus areas for this prompt)
        }
      }
    ] (array of 5 refined prompts)
  }`,
  PEEL_GENERATOR: `
  The response must conform to the following structure:
  {
    content: {
      point: string (required, a clear statement of the main idea or argument),
      evidence: string (required, specific examples, data, or quotes that support the point),
      explanation: string (required, analysis of how the evidence supports the point),
      link: string (required, a connection back to the main argument or transition),
      feedback: {
        strengths: string (required, list of strengths in the paragraph),
        improvements: string (required, list of areas for improvement)
      }
    },
    metadata: {
      subject: string (optional, the subject area of the paragraph),
      complexity: string (optional, the complexity level of the paragraph),
      timestamp: string (required, ISO timestamp of when the paragraph was generated)
    }
  }`,
  RUBRIC_GENERATOR: `
  The response must exactly match this JSON schema structure:
  {
    "data": {
      "id": "string (UUID)",
      "version": "string (e.g., '1.0')",
      "createdAt": "string (ISO date)",
      "metadata": {
        "subject": "string (proper academic subject, NOT the assignment type)",
        "topic": "string",
        "assessmentType": "string",
        "assessor": "string (based on assessmentType: 'Peer', 'Self', or 'Class Teacher')",
        "keyStage": "string",
        "level": "number"
      },
      "rubric": {
        "criteria": [
          {
            "name": "string",
            "levels": {
              "exceptional": {
                "score": 5,
                "description": "string",
                "feedback": "string"
              },
              "advanced": {
                "score": 4,
                "description": "string",
                "feedback": "string"
              },
              "proficient": {
                "score": 3,
                "description": "string",
                "feedback": "string"
              },
              "basic": {
                "score": 2,
                "description": "string",
                "feedback": "string"
              },
              "emerging": {
                "score": 1,
                "description": "string",
                "feedback": "string"
              }
            }
          }
        ]
      }
    }
  }`,
} as const
