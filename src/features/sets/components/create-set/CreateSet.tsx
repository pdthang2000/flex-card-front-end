import { Divider, Input } from 'antd';
import CardInput from './CardInput';

const CreateSet = () => {
  return (
    <div className={'w-full text-white mx-auto px-10'}>
      <div className={'w-full'}>
        <p className={'text-xl font-bold my-10 pb-2'}>Create a new Set</p>
        <Input
          className={'text-white placeholder-gray-500 w-1/2 p-0'}
          placeholder={'Set name'}
          style={{
            fontSize: '20px',
          }}
          bordered={false}
          maxLength={100}
        />
        <div className={'w-1/2 pb-2'}>
          <Divider className={'m-0 h-0.5 bg-white'} />
          <p className={'text-xs pt-1'}>TITLE</p>
        </div>
        <Input
          className={'text-white placeholder-gray-500 w-1/2 p-0'}
          placeholder={'Add a description...'}
          style={{
            fontSize: '20px',
          }}
          bordered={false}
          maxLength={100}
        />
        <div className={'w-1/2'}>
          <Divider className={'m-0 h-0.5 bg-white'} />
          <p className={'text-xs pt-1'}>DESCRIPTION</p>
        </div>
      </div>
      <CardInput />
      <CardInput />
      <CardInput />
    </div>
  );
};

export default CreateSet;
