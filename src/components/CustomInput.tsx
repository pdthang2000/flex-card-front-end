import { Divider, Form, Input } from 'antd';
import { useState } from 'react';
interface CustomInputProps {
  formName: string;
  rules?: any;
  footer: string;
  placeholder?: string;
  message?: string;
}
const CustomInput = ({
  formName,
  rules,
  footer,
  placeholder,
  message,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div>
      <Form.Item name={formName} rules={rules}>
        <Input
          className={'text-white placeholder-gray-500 w-1/2 p-0'}
          placeholder={placeholder}
          style={{ fontSize: '20px' }}
          bordered={false}
          maxLength={100}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Form.Item>
      <div className={'w-1/2 pb-2'}>
        <Divider
          className={`m-0 ${
            isFocused ? ' bg-yellow-500 h-1 ' : ' bg-white h-0.5 '
          }`}
        />
        <p className={'text-xs pt-1'}>{footer}</p>
      </div>
    </div>
  );
};

export default CustomInput;
