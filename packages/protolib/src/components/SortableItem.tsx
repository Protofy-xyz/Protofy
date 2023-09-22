import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function seededRandom(seed) {
    const m = 0x80000000;
    const a = 1664525;
    const c = 1013904223;
    for (let i = 0; i < 5; i++) {   // Introducing multiple iterations to increase variation
        seed = (a * seed + c) % m;
    }
    return seed / m;  // returns a value between 0 and 1
}

export function SortableItem({id, children}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* <div style={{width: '400px', height: '150px', backgroundColor: colorFromSeed(id) }}></div> */}
      {children}
    </div>
  );
}