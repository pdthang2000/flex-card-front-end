import { Col, Row, Select, Space } from 'antd';
import { SearchBar } from './SearchBar';
import FlashCard from '../../../components/FlashCard/FlashCard';
import { useSelector } from 'react-redux';
import { selectCardList, selectCardListPagination } from '../selector';
import { Card } from '../../../models/Card';
import { useCallback, useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { CardDisplayState } from '../../../enums';
import CustomPagination from '../../../components/CustomPagination';
import { loadingCardList } from '../reducer';
const { Option } = Select;

const Home = () => {
  const [cardState, setCardState] = useState<CardDisplayState>(
    CardDisplayState.FRONT,
  );

  const pagination = useSelector(selectCardListPagination);
  const cardList = useSelector(selectCardList);

  const renderCardList = useCallback(() => {
    const rows = [];
    const span = 5;
    const offset = 1;
    const cardsPerRow = 4;

    for (let i = 0; i < cardList.length; i += cardsPerRow) {
      const columns = [];
      for (let j = 0; j < cardsPerRow; j++) {
        const cardIndex = i + j;
        const card = cardList[cardIndex];

        if (card) {
          columns.push(
            <Col
              key={cardIndex}
              span={span}
              offset={j > 0 ? offset : 0}
              className={'h-48'}
            >
              <FlashCard card={card as Card} state={cardState} />
            </Col>,
          );
        }
      }

      rows.push(
        <Row className={'mb-10'} key={i}>
          {columns}
        </Row>,
      );
    }

    return rows;
  }, [cardList, cardState]);

  const handleChange = (value: CardDisplayState) => {
    setCardState(value);
  };

  return (
    <div className={'p-10'}>
      <Row>
        <Col span={10}>
          <SearchBar />
        </Col>
        <Col span={8} offset={2} className={'flex items-center'}>
          <CustomPagination
            className={'bg-sub-main w-fit rounded-md h-fit'}
            total={pagination.total ?? 0}
            totalPages={pagination.totalPages ?? 0}
            pageSize={pagination.take ?? 0}
            fetchDataForPage={loadingCardList}
          />
        </Col>
        <Col span={4} offset={0}>
          <Select
            size={'large'}
            defaultValue={CardDisplayState.FRONT}
            className={'custom-select w-3/4'}
            onChange={handleChange}
            suffixIcon={<CaretDownOutlined className={'text-white'} />}
          >
            {Object.values(CardDisplayState).map((state) => (
              <Option key={state} value={state} label={state}>
                <Space>Show{state}</Space>
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <div className={'mt-10'}>{renderCardList()}</div>
      <div className={'flex justify-center items-center w-full'}>
        <CustomPagination
          className={'bg-sub-main w-fit rounded-md'}
          total={pagination.total ?? 0}
          totalPages={pagination.totalPages ?? 0}
          pageSize={pagination.take ?? 0}
          fetchDataForPage={loadingCardList}
        />
      </div>
    </div>
  );
};

export default Home;
