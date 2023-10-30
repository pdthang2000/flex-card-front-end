import { SearchBar } from '../../main-page/components/SearchBar';
import { Col, Row, Select, Space } from 'antd';
import SetCard from './SetCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadingSetList } from '../reducer';
import { selectSetList } from '../selector';
import { Link } from 'react-router-dom';

const { Option } = Select;

const SetHomePage = () => {
  const sortType = (e: any) => {
    console.log(e.value);
  };

  const dispatch = useDispatch();

  const setList = useSelector(selectSetList);

  useEffect(() => {
    dispatch(loadingSetList({}));
  }, []);

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
        <Col span={12} offset={1} className={'h-12'}>
          <SearchBar />
        </Col>
      </Row>
      {setList.map((set) => {
        if (!set) return;
        return (
          <Row className={'pb-5'} key={set.id}>
            <Col span={18} className={'h-20'}>
              <Link to={`${set.id}`}>
                <SetCard set={set} />
              </Link>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default SetHomePage;
