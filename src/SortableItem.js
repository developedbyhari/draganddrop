import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                padding: "10px",
                margin: "5px 0",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "grab",
            }}
        >
            {id}
        </div>
    );
};

export default SortableItem;