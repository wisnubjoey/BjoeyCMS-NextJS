import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface Props {
  id: number;
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableFeatureItem({ id, title, description, onEdit, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="p-1 hover:text-indigo-600">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-1 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}