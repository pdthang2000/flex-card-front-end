import { Button, Divider, Form, Input, Modal } from 'antd';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Card } from '../../models/Card';
import { useDispatch } from 'react-redux';
import { useForm } from 'antd/es/form/Form';
import { updatingCard } from '../../features/cards/reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Setter {
  (open: boolean): void;
}

interface EditFlashcardProps {
  card: Card;
  open: boolean;
  setOpen: Setter;
}

const { TextArea } = Input;

const EditFlashcard = ({ card, open, setOpen }: EditFlashcardProps) => {
  const dispatch = useDispatch();

  const [form] = useForm();

  const [cardState, setCardState] = useState<Card>({
    front: '',
    back: '',
    id: '',
  });
  const [isFrontCardFocused, setIsFrontCardFocused] = useState(false);
  const [isBackCardFocused, setIsBackCardFocused] = useState(false);

  useEffect(() => {
    setCardState(card);
  }, [card]);

  const onSubmit = () => {
    dispatch(
      updatingCard({
        ...form.getFieldsValue(),
        id: card.id,
      }),
    );
    setOpen(false);
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <Modal
        width={1000}
        open={open}
        className={'main-modal'}
        onCancel={() => setOpen(false)}
        maskClosable={true}
        footer={[
          <Button
            onClick={() => setOpen(false)}
            className={'text-blue-300 border-transparent hover:border-white'}
          >
            Cancel
          </Button>,
          <Button
            onClick={onSubmit}
            className={
              'text-white font-bold bg-blue-600 border-0 hover-text-white ' +
              'hover:bg-blue-800'
            }
          >
            Save
          </Button>,
        ]}
        closeIcon={
          <FontAwesomeIcon size={'lg'} icon={faX} className={'text-gray-300'} />
        }
      >
        <div className={'text-white pl-5'} style={{ maxHeight: '35rem' }}>
          <p className={'text-3xl font-bold mb-5'}>Edit</p>
          <div className={'w-full mb-10 overflow-y-auto max-h-[30rem]'}>
            <div
              className={'w-full h-fit pb-1 break-words whitespace-pre-wrap'}
            >
              <Form.Item name="front" initialValue={cardState.front}>
                <TextArea
                  className={'text-white w-full p-0'}
                  style={{ fontSize: '20px' }}
                  bordered={false}
                  maxLength={1024}
                  autoSize
                  onFocus={() => setIsFrontCardFocused(true)}
                  onBlur={() => setIsFrontCardFocused(false)}
                />
              </Form.Item>
            </div>
            <div className={'w-full pr-3'}>
              <Divider
                className={`m-0 ${
                  isFrontCardFocused
                    ? ' bg-yellow-500 h-1'
                    : ' bg-gray-300 h-0.5'
                }`}
              />
              <p
                className={`text-xs font-bold pt-1 ${
                  isFrontCardFocused ? ' text-yellow-500' : ' text-gray-300'
                }`}
              >
                FRONT
              </p>
            </div>
            <div
              className={
                'w-full h-fit pb-1 pt-5 break-words whitespace-pre-wrap'
              }
            >
              <Form.Item name="back" initialValue={cardState.back}>
                <TextArea
                  name={'backCard'}
                  className={'text-white w-full p-0'}
                  style={{ fontSize: '20px' }}
                  bordered={false}
                  maxLength={1024}
                  autoSize
                  defaultValue={card.back}
                  onFocus={() => setIsBackCardFocused(true)}
                  onBlur={() => setIsBackCardFocused(false)}
                />
              </Form.Item>
            </div>
            <div className={'w-full pr-3'}>
              <Divider
                className={`m-0 ${
                  isBackCardFocused
                    ? ' bg-yellow-500 h-1 '
                    : ' bg-gray-300 h-0.5 '
                }`}
              />
              <p
                className={`text-xs font-bold pt-1 ${
                  isBackCardFocused ? ' text-yellow-500' : ' text-gray-300'
                }`}
              >
                BACK
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
};

export default EditFlashcard;
