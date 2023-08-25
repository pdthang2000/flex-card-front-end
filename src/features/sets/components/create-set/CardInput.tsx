import { Col, Divider, Input, Row } from 'antd';

const CardInput = () => {
  return (
    <div className={'w-full h-36 rounded-md bg-sub-main my-5'}>
      <div className={'p-4'}>1</div>
      <Divider className={'h-0.5 bg-main m-0'} />
      <Row className={'w-full p-4'}>
        <Col span={11}>
          <Input
            className={'text-white placeholder-gray-500 w-full p-0'}
            placeholder={'Front card description...'}
            bordered={false}
            maxLength={100}
          />
          <div className={'w-full pb-2'}>
            <Divider className={'m-0 h-0.5 bg-white'} />
            <p className={'text-xs pt-1'}>FRONT</p>
          </div>
        </Col>
        <Col span={11} offset={1}>
          <Input
            className={'text-white placeholder-gray-500 w-full p-0'}
            placeholder={'Back card description...'}
            bordered={false}
            maxLength={100}
          />
          <div className={'w-full pb-2'}>
            <Divider className={'m-0 h-0.5 bg-white'} />
            <p className={'text-xs pt-1'}>BACK</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CardInput;
