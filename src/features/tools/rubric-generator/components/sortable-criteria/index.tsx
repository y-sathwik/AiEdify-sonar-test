import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable criterion component
interface SortableCriterionProps {
  id: string
  criterion: string
  index: number
  updateCriterion: (index: number, value: string) => void
  removeCriterion: (index: number) => void
}

const SortableCriterion = ({
  id,
  criterion,
  index,
  updateCriterion,
  removeCriterion,
}: SortableCriterionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div {...attributes} {...listeners} className="cursor-move p-2">
        ⋮⋮
      </div>
      <Input
        value={criterion}
        onChange={(e) => updateCriterion(index, e.target.value)}
        placeholder={`Criterion ${index + 1}`}
        required
      />
      {index > 0 && (
        <Button type="button" variant="outline" size="icon" onClick={() => removeCriterion(index)}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      )}
    </div>
  )
}

// Main sortable criteria component
interface SortableCriteriaProps {
  readonly criteria: readonly string[]
  readonly addCriterion: () => void
  readonly removeCriterion: (index: number) => void
  readonly updateCriterion: (index: number, value: string) => void
  readonly handleDragEnd: (event: DragEndEvent) => void
}

export default function SortableCriteria({
  criteria,
  addCriterion,
  removeCriterion,
  updateCriterion,
  handleDragEnd,
}: SortableCriteriaProps) {
  // Setup sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Assessment Criteria</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCriterion}
          disabled={criteria.length >= 6}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
          >
            <path
              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          Add Criterion
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={criteria.map((_, index) => `criterion-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {criteria.map((criterion, index) => (
              <SortableCriterion
                key={`criterion-${index}`}
                id={`criterion-${index}`}
                criterion={criterion}
                index={index}
                updateCriterion={updateCriterion}
                removeCriterion={removeCriterion}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {criteria.length === 6 && (
        <p className="mt-2 text-xs text-amber-600">Maximum number of criteria reached (6)</p>
      )}

      <p className="mt-4 text-xs text-gray-500">
        Drag and drop to reorder criteria. Each criterion will become a row in your rubric.
      </p>
    </div>
  )
}
