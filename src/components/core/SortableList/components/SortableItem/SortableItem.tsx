import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mantine/core';
import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import classes from './SortableItem.module.css';

interface Props {
  id: UniqueIdentifier;
  component?: any;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(_node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export default function SortableItem({
  children,
  id,
  component,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <Box
        component={component}
        className="SortableItem"
        w="100%"
        ref={setNodeRef}
        style={style}
      >
        {children}
      </Box>
    </SortableItemContext.Provider>
  );
}

export function DragHandle({ children }: { children: ReactNode }) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <div className={classes.dragger} {...attributes} {...listeners} ref={ref}>
      {children}
    </div>
  );
}
