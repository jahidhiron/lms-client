import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Stack } from '@mantine/core';
import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import SortableItem from './components/SortableItem';
import { DragHandle } from './components/SortableItem/SortableItem';
import SortableOverlay from './components/SortableOverlay';

export interface BaseItem {
  id: UniqueIdentifier;
  value: string;
}

interface Props<T> {
  items: T[];
  onChange(_items: T[]): void;
  view?: 'stack' | 'table';
  renderItem(
    _item: T,
    _index?: number,
    _getId?: Props<T>['getItemId']
  ): ReactNode;

  getItemId: (_item: T) => UniqueIdentifier;
}

export default function SortableList<T>({
  items,
  onChange,
  renderItem,
  view = 'stack',
  getItemId,
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const Comp = view === 'stack' ? Stack : React.Fragment;
  const { activeItem, activeIndex } = useMemo(() => {
    const activeIndex = items.findIndex(
      (item) => getItemId(item) === active?.id
    );
    if (activeIndex == -1) {
      return { activeItem: null, activeIndex: Infinity };
    }
    const activeItem = items.at(activeIndex);
    return {
      activeIndex,
      activeItem,
    };
  }, [active, items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragOver={({ active }) => {
        setActive(active);
      }}
      onDragMove={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(
            (item) => getItemId(item) === active.id
          );
          const overIndex = items.findIndex(
            (item) => getItemId(item) === over.id
          );

          onChange(arrayMove(items, activeIndex, overIndex));
        }

        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      {/* @ts-ignore */}
      <SortableContext items={items}>
        <Comp
          {...(view === 'stack'
            ? { gap: 'xs', w: '100%', role: 'application' }
            : {})}
        >
          {items.map((item, index) => (
            <React.Fragment key={getItemId(item)}>
              {renderItem(item, index, getItemId)}
            </React.Fragment>
          ))}
        </Comp>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem, activeIndex, getItemId) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
