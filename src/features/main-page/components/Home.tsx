import { Col, Row, Select, Space } from 'antd';
import { SearchBar } from './SearchBar';
import FlashCard from '../../../components/FlashCard/FlashCard';
import { useSelector } from 'react-redux';
import { selectCardList, selectCardListPagination } from '../selector';
import { useCallback, useState } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { CardDisplayState, TextSize } from '../../../enums';
import CustomPagination from '../../../components/CustomPagination';
import { loadingCardList } from '../reducer';
import BothSideHorizontalCard from '../../../components/FlashCard/BothSideHorizontalCard';

const { Option } = Select;

const Home = () => {
  const [cardState, setCardState] = useState<CardDisplayState>(
    CardDisplayState.FRONT,
  );

  const pagination = useSelector(selectCardListPagination);
  const cardList = useSelector(selectCardList);

  const renderHorizontalCard = useCallback(() => {
    const rows = [];
    for (const card of cardList) {
      if (!card) {
        continue;
      }
      rows.push(<BothSideHorizontalCard card={card} />);
    }
    return rows;
  }, [cardList, cardState]);

  const renderDefaultCard = useCallback(() => {
    const rows = [];
    const span = 11;
    const offset = 1;
    const cardsPerRow = 2;

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
              className={`${
                cardState === CardDisplayState.VERTICAL ? 'h-80' : 'h-64'
              }`}
            >
              <FlashCard
                card={card}
                state={cardState}
                textSize={TextSize.LARGE}
              />
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
            className={'custom-select w-full'}
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
      <div className={'mt-10'}>
        {(cardState === CardDisplayState.FRONT ||
          cardState === CardDisplayState.BACK ||
          cardState === CardDisplayState.VERTICAL) &&
          renderDefaultCard()}
        {cardState === CardDisplayState.HORIZONTAL && renderHorizontalCard()}
      </div>
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
