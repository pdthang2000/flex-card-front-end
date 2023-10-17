import { Button, Divider, Input, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Card } from '../../models/Card';

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
  const [isFrontCardFocused, setIsFrontCardFocused] = useState(false);
  const [isBackCardFocused, setIsBackCardFocused] = useState(false);
  const onOk = () => {
    setOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      width={1000}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      className={'main-modal'}
      maskClosable={true}
      footer={[
        <Button
          className={'text-blue-300 border-transparent hover:border-white'}
        >
          Cancel
        </Button>,
        <Button
          className={
            'text-white font-bold bg-blue-600 border-0 hover-text-white ' +
            'hover:bg-blue-800'
          }
        >
          Save
        </Button>,
      ]}
      closeIcon={<CloseOutlined className={'font-bold text-gray-300'} />}
    >
      <div className={'text-white pl-5'} style={{ maxHeight: '35rem' }}>
        <p className={'text-3xl font-bold mb-5'}>Edit</p>
        <div
          className={'w-full mb-10 overflow-y-auto'}
          style={{ maxHeight: '30rem' }}
        >
          <div className={'w-full h-fit pb-1 break-words whitespace-pre-wrap'}>
            <TextArea
              className={'text-white w-full p-0'}
              style={{ fontSize: '20px' }}
              bordered={false}
              maxLength={1024}
              autoSize
              defaultValue={card.front}
              onFocus={() => setIsFrontCardFocused(true)}
              onBlur={() => setIsFrontCardFocused(false)}
            />
          </div>
          <div className={'w-full pr-3'}>
            <Divider
              className={`m-0 ${
                isFrontCardFocused ? ' bg-yellow-500 h-1' : ' bg-white h-0.5'
              }`}
            />
            <p
              className={`text-xs pt-1 ${
                isFrontCardFocused ? ' text-yellow-500' : ' text-white'
              }`}
            >
              FRONT
            </p>
          </div>
          <div
            className={'w-full h-fit pb-1 pt-5 break-words whitespace-pre-wrap'}
          >
            <TextArea
              className={'text-white w-full p-0'}
              style={{ fontSize: '20px' }}
              bordered={false}
              maxLength={1024}
              autoSize
              defaultValue={card.back}
              onFocus={() => setIsBackCardFocused(true)}
              onBlur={() => setIsBackCardFocused(false)}
            />
          </div>
          <div className={'w-full pr-3'}>
            <Divider
              className={`m-0 ${
                isBackCardFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
              }`}
            />
            <p
              className={`text-xs pt-1 ${
                isBackCardFocused ? ' text-yellow-500' : ' text-white'
              }`}
            >
              DESCRIPTION
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditFlashcard;
