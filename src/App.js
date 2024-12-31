import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const Container = ({ id, items, isOver, activeId }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: "20px",
        border: `1px solid ${isOver ? "blue" : "black"}`,
        borderRadius: "8px",
        minHeight: "300px",
        width: "250px",
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.length > 0 ? (
          items
            .filter((itemId) => itemId !== activeId)
            .map((id) => <SortableItem key={id} id={id} />)
        ) : (
          <div
            style={{
              height: "100%",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #ccc",
              borderRadius: "4px",
              color: "#999",
            }}
          >
            Drop here
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState({
    container1: ["Item 1", "Item 2", "Item 3"],
    container2: [],
    container3: [],
    container4: [],
  });
  const [activeId, setActiveId] = useState(null);
  const [overContainer, setOverContainer] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setOverContainer(over ? over.id : null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverContainer(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overId = over.id;
    const overContainer = findContainer(overId) || overId;

    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(over.id);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    } else {
      setItems((prev) => {
        const activeItems = [...prev[activeContainer]];
        const overItems = [...prev[overContainer]];

        const activeIndex = activeItems.indexOf(active.id);
        activeItems.splice(activeIndex, 1);

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: [...overItems, active.id],
        };
      });
    }

    setActiveId(null);
    setOverContainer(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {Object.keys(items).map((containerId) => (
          <Container
            key={containerId}
            id={containerId}
            items={items[containerId]}
            isOver={overContainer === containerId}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <div
            style={{
              padding: "10px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;