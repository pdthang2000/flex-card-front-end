import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import {
  arrayMove as dndKitArrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, notification, Skeleton } from 'antd';
import CardInput from './CardInput';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../../../../components/CustomInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { SetActions } from '../../../../enums';
import { useNavigate, useParams } from 'react-router-dom';
import {
  removeNewSetId,
  creatingSet,
  loadingSet,
  updatingSet,
} from '../../../cards/reducer';
import {
  selectCardListLoading,
  selectNewSetId,
  selectSetFormObj,
} from '../../../cards/selector';

export const arrayMove = (array: any, oldIndex: any, newIndex: any) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

const SortableItem = ({ id, handleRemove, index, ...props }: any) => {
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
    <div style={style} ref={setNodeRef}>
      <CardInput
        handleRemove={handleRemove}
        id={id}
        setActivatorNodeRef={setActivatorNodeRef}
        propsDND={{ ...attributes, ...listeners }}
        index={index}
        propsForm={props}
      />
    </div>
  );
};

interface CreateOrEditSetProps {
  type: SetActions;
}

const defaultItems = ['0', '1'];

const CreateOrUpdateSet = ({ type }: CreateOrEditSetProps) => {
  const dispatch = useDispatch();

  const { setId } = useParams();

  const navigate = useNavigate();

  const [items, setItems] = useState<any>(defaultItems);
  const [active, setActive] = useState(null);

  const cardFormObj = useSelector(selectSetFormObj);
  const setLoading = useSelector(selectCardListLoading);
  const newSetId = useSelector(selectNewSetId);

  const [form] = useForm();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      key: 'updatable',
      message: <p className={'text-white'}>Missing information</p>,
      description: (
        <p className={'text-white'}>
          A set need at least 2 cards to be created.
        </p>
      ),
      style: {
        background: '#2E3856',
      },
      placement: 'bottomRight',
      closeIcon: (
        <FontAwesomeIcon size={'sm'} icon={faX} className={'text-white'} />
      ),
    });
  };

  useEffect(() => {
    if (type === SetActions.CREATE && newSetId) {
      const id = newSetId;
      dispatch(removeNewSetId());
      navigate(`../${id}`);
    }
  }, [newSetId]);

  useEffect(() => {
    if (type === SetActions.UPDATE) {
      form.setFieldsValue(cardFormObj);
      const initItems: any[] = [];
      Object.keys(cardFormObj).forEach((key: any, index) => {
        if (cardFormObj[key]?.id) {
          initItems.push(index);
        }
      });
      setItems(initItems);
    }
  }, [cardFormObj]);

  useEffect(() => {
    if (type === SetActions.UPDATE) {
      dispatch(loadingSet(setId));
    }
    if (type === SetActions.CREATE) {
      form.resetFields();
      setItems(defaultItems);
      // dispatch(clearSet());
    }
  }, [type]);

  const onFinish = (values: any) => {
    if (!values['0'] || !values['1']) {
      openNotification();
      return;
    }
    if (type === SetActions.CREATE) {
      dispatch(creatingSet(values));
      if (!setLoading) {
        console.log(1234);
        // navigate(`../${cardFormObj.setId}`);
      }
    }
    if (type === SetActions.UPDATE) {
      dispatch(updatingSet({ ...values, id: setId }));
      if (!setLoading) {
        navigate('../');
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: any) => setActive(active.id);

  const handleDragCancel = () => setActive(null);

  const handleDragOver = () => {};
  // const handleDragOver = ({ active, over }: any) => {}

  const handleRemove = (id: string) => {
    form.setFieldValue(id, undefined);
    setItems(items.filter((item: string) => item !== id));
  };

  const handleAdd = () => {
    setItems([...items, items.length.toString()]);
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (!over || active.id === over.id) {
      setActive(null);
      return;
    }

    const activeIndex = items.indexOf(active.id);
    const overIndex = items.indexOf(over.id);

    const activeFormValue = form.getFieldValue(activeIndex);
    const overFormValue = form.getFieldValue(overIndex);

    form.setFieldValue(activeIndex, overFormValue);
    form.setFieldValue(overIndex, activeFormValue);

    setItems(arrayMove(items, activeIndex, overIndex));
    setActive(null);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className={'w-[80rem] max-w-full mx-auto text-white px-10 pb-10'}
    >
      {contextHolder}
      <div className={'h-20 sticky top-0 mb-10 z-10 bg-main'}>
        <div
          className={
            'text-xl font-bold flex items-center justify-between w-full h-full'
          }
        >
          {type === SetActions.CREATE && <p>Create a new Set</p>}
          {type === SetActions.UPDATE && <p></p>}
          <Button
            type={'primary'}
            className={'bg-blue-500'}
            htmlType={'submit'}
            loading={setLoading}
          >
            {type === SetActions.CREATE && 'Create'}
            {type === SetActions.UPDATE && 'Save'}
          </Button>
        </div>
      </div>
      <div className={'w-full mb-10'}>
        <CustomInput
          formName={'title'}
          footer={'TITLE'}
          placeholder={`Set's title ...`}
          rules={[{ required: true, message: 'Please enter Title' }]}
        />
        <CustomInput
          formName={'description'}
          footer={'DESCRIPTION'}
          placeholder={`Set's description ...`}
        />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} id={'context-1'}>
          {items.map((item: any, index: number) => (
            <Form.Item key={index} name={index}>
              <SortableItem
                id={item}
                handleRemove={handleRemove}
                index={index + 1}
              />
            </Form.Item>
          ))}
          <div
            className={`w-full h-24 rounded-md bg-sub-main japan-red-dot mt-3`}
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
            <Button
              type={'primary'}
              className={'bg-blue-500 py-2 h-fit'}
              htmlType={'submit'}
              loading={setLoading}
            >
              {type === SetActions.CREATE && 'Create'}
              {type === SetActions.UPDATE && 'Save'}
            </Button>
          </div>
        </SortableContext>
        <DragOverlay>
          {active ? <CardSkeleton id={active} /> : null}
        </DragOverlay>
      </DndContext>
    </Form>
  );
};

const CardSkeleton = (id: any) => {
  return (
    <div id={id}>
      <Skeleton />
    </div>
  );
};
export default CreateOrUpdateSet;
