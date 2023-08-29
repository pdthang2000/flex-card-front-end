import { Col, Divider, Input, Row } from 'antd';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

interface CardInputProps {
  handleRemove: any;
  id: string;
  index: number;
  setActivatorNodeRef: any;
  props: any;
}

const CardInput = ({
  id,
  index,
  setActivatorNodeRef,
  handleRemove,
  props,
}: CardInputProps) => {
  const [isFrontFocused, setIsFrontFocused] = useState(false);
  const [isBackFocused, setIsBackFocused] = useState(false);
  return (
    <div className={'w-full h-fit rounded-md bg-sub-main my-5'}>
      <div className={'flex justify-between items-center p-4'}>
        <div className={'text-md'}>{index}</div>
        <div>
          <HolderOutlined
            ref={setActivatorNodeRef}
            {...props}
            className={'mr-4 hover:text-yellow-300'}
          />
          <DeleteOutlined
            className={'hover:text-yellow-300'}
            onClick={() => handleRemove(id)}
          />
        </div>
      </div>
      <Divider className={'h-0.5 bg-main m-0'} />
      <Row className={'w-full p-4'}>
        <Col span={11}>
          <TextArea
            className={'text-white placeholder-gray-500 w-full p-0'}
            placeholder={'Front card description...'}
            bordered={false}
            maxLength={100}
            autoSize
            onFocus={() => setIsFrontFocused(true)}
            onBlur={() => setIsFrontFocused(false)}
          />
          <div className={'w-full'}>
            <Divider
              className={`m-0 ${
                isFrontFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
              }`}
            />
            <p className={'text-xs pt-1'}>FRONT</p>
          </div>
        </Col>
        <Col span={11} offset={1}>
          <TextArea
            className={'text-white placeholder-gray-500 w-full p-0'}
            placeholder={'Back card description...'}
            bordered={false}
            maxLength={100}
            autoSize
            onFocus={() => setIsBackFocused(true)}
            onBlur={() => setIsBackFocused(false)}
          />
          <div className={'w-full pb-2'}>
            <Divider
              className={`m-0 ${
                isBackFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
              }`}
            />
            <p className={'text-xs pt-1'}>BACK</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CardInput;
