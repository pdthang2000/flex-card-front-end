import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove as dndKitArrayMove } from '@dnd-kit/sortable';
import { Button, Divider, Input, Skeleton } from 'antd';
import CardInput from './CardInput';
import { now } from 'lodash';

export const arrayMove = (array: any, oldIndex: any, newIndex: any) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

const SortableItem = ({ id, handleRemove, index }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
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
    <li style={style} ref={setNodeRef}>
      <CardInput
        handleRemove={handleRemove}
        id={id}
        setActivatorNodeRef={setActivatorNodeRef}
        props={{ ...attributes, ...listeners }}
        index={index}
      />
    </li>
  );
};

const CreateSet = () => {
  const [items, setItems] = useState<any>(['1', '2', '3', '4', '5']);

  const [active, setActive] = useState(null);

  const [isNameInputFocused, setIsNameInputFocused] = useState(false);
  const [isDesInputFocused, setIsDesInputFocused] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: any) => setActive(active.id);

  const handleDragCancel = () => setActive(null);

  const handleDragOver = ({ active, over }: any) => {
    console.log('DragOver', active, over);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item: string) => item !== id));
  };

  const handleAdd = () => {
    setItems([...items, now().toString()]);
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.indexOf(active.id);
      const overIndex = items.indexOf(over.id);
      setItems(arrayMove(items, activeIndex, overIndex));
    }
    setActive(null);
  };

  return (
    <div className={'w-3/4 text-white mx-auto px-10 pb-10'}>
      <div className={'h-20 sticky top-0 mb-10 z-10 bg-main'}>
        <div
          className={
            'text-xl font-bold flex items-center justify-between w-full h-full'
          }
        >
          <p>Create a new Set</p>
          <Button type={'primary'} className={'bg-blue-500'}>
            Create
          </Button>
        </div>
      </div>
      <div className={'w-full mb-10'}>
        <Input
          className={'text-white placeholder-gray-500 w-1/2 p-0'}
          placeholder={'Set name'}
          style={{ fontSize: '20px' }}
          bordered={false}
          maxLength={100}
          onFocus={() => setIsNameInputFocused(true)}
          onBlur={() => setIsNameInputFocused(false)}
        />
        <div className={'w-1/2 pb-2'}>
          <Divider
            className={`m-0 ${
              isNameInputFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
            }`}
          />
          <p className={'text-xs pt-1'}>TITLE</p>
        </div>
        <Input
          className={'text-white placeholder-gray-500 w-1/2 p-0'}
          placeholder={'Add a description...'}
          style={{ fontSize: '20px' }}
          bordered={false}
          maxLength={100}
          onFocus={() => setIsDesInputFocused(true)}
          onBlur={() => setIsDesInputFocused(false)}
        />
        <div className={'w-1/2'}>
          <Divider
            className={`m-0 ${
              isDesInputFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
            }`}
          />
          <p className={'text-xs pt-1'}>DESCRIPTION</p>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} id={'context-1'}>
          <ul className={'w-full items-center'}>
            {items.map((item: any, index: number) => (
              <SortableItem
                key={item}
                id={item}
                handleRemove={handleRemove}
                index={index + 1}
              />
            ))}
            <div
              className={
                'w-full h-24 rounded-md bg-sub-main flex items-center justify-center'
              }
            >
              <div
                className={
                  'text-md text-white hover:text-yellow-300 cursor-pointer'
                }
                onClick={handleAdd}
              >
                + ADD CARD
              </div>
            </div>
            <div className={'flex items-center justify-end w-full mt-5'}>
              <Button type={'primary'} className={'bg-blue-500 py-2 h-fit'}>
                Create
              </Button>
            </div>
          </ul>
        </SortableContext>
        <DragOverlay>
          {active ? <CardSkeleton id={active} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const CardSkeleton = (id: any) => {
  return (
    <div id={id}>
      <Skeleton />
    </div>
  );
};
export default CreateSet;
