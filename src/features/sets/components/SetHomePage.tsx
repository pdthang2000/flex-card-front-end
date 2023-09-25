import { SearchBar } from '../../main-page/components/SearchBar';
import { Col, Row, Select, Space } from 'antd';
import SetCard from './SetCard';

const { Option } = Select;

const SetHomePage = () => {
  const sortType = (e: any) => {
    console.log(e.value);
  };
  return (
    <div className={'p-10'}>
      <Row className={'pb-10'}>
        <Col span={5}>
          <Select
            bordered={false}
            className={'h-full w-full rounded-2xl text-xl'}
            defaultValue="china"
            style={{ background: 'black' }}
            onChange={sortType}
          >
            <Option value="china" label="China">
              <Space className={''}>China (中国)</Space>
            </Option>
            <Option value="usa" label="USA" className={'text-white'}>
              <Space>USA (美国)</Space>
            </Option>
          </Select>
        </Col>
        <Col span={12} offset={1}>
          <SearchBar />
        </Col>
      </Row>
      <Row className={'pb-5'}>
        <Col span={18} className={'h-20'}>
          <SetCard setName={'Chinese basic 1'} totalCard={10} />
        </Col>
      </Row>
      <Row className={'pb-5'}>
        <Col span={18} className={'h-20'}>
          <SetCard setName={'Traditional 2'} totalCard={20} />
        </Col>
      </Row>
      <Row className={'pb-5'}>
        <Col span={18} className={'h-20'}>
          <SetCard setName={'Advanced English 3'} totalCard={15} />
        </Col>
      </Row>
    </div>
  );
};

export default SetHomePage;
