import FlashCard from '../../../components/FlashCard/FlashCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardDisplayState, TextSize } from '../../../enums';
import { Button, Col, Row } from 'antd';
import { loadingSet } from '../../main-page/reducer';
import { selectCardList } from '../../main-page/selector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faShuffle,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { useLoadingContext } from '../../../contexts/LoadingContext';

const SetDetail = () => {
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoadingContext();
  const { id } = useParams();
  const cards = useSelector(selectCardList);

  const [currentId, setCurrentId] = useState<number>(0);
  const [displayCards, setDisplayCards] = useState<any[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadingSet(id));
  }, []);

  useEffect(() => {
    showLoading();
    if (cards.length === 0) {
      showLoading();
      return;
    }
    if (displayCards.length === 0) {
      setDisplayCards([
        {
          id: 0,
          cardId: cards[0]?.id,
          className: 'pt-10 w-full swipe',
          card: cards[0],
        },
        {
          id: 1,
          cardId: cards[1]?.id,
          className: 'pt-10 swipe swipe-right',
          card: cards[1],
        },
      ]);
    } else {
      const currentCards = [...displayCards];
      let index = 0;
      for (const card of currentCards) {
        if (card.id === currentId) {
          break;
        }
        index++;
      }
      currentCards[index].card = cards[currentId];
      setDisplayCards(currentCards);
    }
    hideLoading();
  }, [cards]);

  const shuffling = () => {
    setIsShuffle(!isShuffle);
  };

  const clickBack = () => {
    if (currentId === 0) {
      return;
    }
    const currentCards = [...displayCards];
    if (currentCards.length == 3) {
      currentCards.pop();
    }

    currentCards[1].className += ' swipe-right';
    currentCards[1].className = currentCards[1].className.replace('w-full');

    let midClass = currentCards[0].className;
    midClass = midClass.replace('swipe-left', 'w-full');
    currentCards[0].className = midClass;

    if (currentCards[0].id - 1 >= 0) {
      currentCards.unshift({
        id: currentCards[0].id - 1,
        className: 'pt-10 swipe swipe-left',
        card: cards[currentCards[0].id - 1],
      });
    }

    setCurrentId(currentId - 1);
    setDisplayCards(currentCards);
  };

  const clickNext = () => {
    if (currentId === cards.length - 1) {
      return;
    }
    const currentCards = [...displayCards];
    if (currentCards.length == 3) {
      currentCards.shift();
    }

    currentCards[0].className += ' swipe-left';
    currentCards[0].className = currentCards[0].className.replace('w-full');

    currentCards[1].className = currentCards[1].className.replace(
      'swipe-right',
      'w-full',
    );

    if (currentCards[currentCards.length - 1].id + 1 !== cards.length) {
      currentCards.push({
        id: currentCards[currentCards.length - 1].id + 1,
        className: 'pt-10 swipe swipe-right',
        card: cards[currentCards[currentCards.length - 1].id + 1],
      });
    }
    setCurrentId(currentId + 1);
    setDisplayCards(currentCards);
  };

  return (
    <div className={'pl-10 w-4/5'}>
      <div className={'card-detail-display'}>
        {displayCards.map((data) => (
          <div
            key={data.id}
            className={data.className}
            style={{ height: '40rem' }}
          >
            {data.card && (
              <FlashCard
                card={data.card}
                state={CardDisplayState.FRONT}
                textSize={TextSize.XXL}
              />
            )}
          </div>
        ))}
      </div>
      {cards.length !== 0 && (
        <Row className={'pt-3'}>
          <Col span={10}></Col>
          <Col span={4}>
            <div className={'flex justify-center w-full'}>
              <Button
                shape={'circle'}
                className={`border-gray-600 border-2 japan-red-dot ${
                  currentId === 0 ? 'cursor-default' : ''
                } w-14 h-14 hover-none`}
                onClick={clickBack}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size={'2xl'}
                  className={`${
                    currentId === 0 ? 'text-gray-600' : 'text-white'
                  }`}
                />
              </Button>
              <div className={'w-10'} />
              <Button
                shape={'circle'}
                className={`border-gray-600 border-2 japan-red-dot ${
                  currentId === cards.length - 1 ? 'cursor-default' : ''
                } w-14 h-14 hover-none`}
                onClick={clickNext}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size={'2xl'}
                  className={`${
                    currentId === cards.length - 1
                      ? 'text-gray-600'
                      : 'text-white'
                  }`}
                />
              </Button>
            </div>
          </Col>
          <Col span={10} className={'flex justify-end'}>
            <Button
              shape={'circle'}
              className={`japan-red-dot border-2 
                          border-gray-600 w-14 h-14 mr-5`}
            >
              <FontAwesomeIcon
                icon={faGear}
                size={'2xl'}
                style={{ color: 'white' }}
              />
            </Button>
            <Button
              shape={'circle'}
              className={`japan-red-dot ${
                isShuffle
                  ? 'border-4 border-gray-400'
                  : 'border-2 border-gray-600'
              } w-14 h-14`}
              onClick={shuffling}
            >
              <FontAwesomeIcon
                icon={faShuffle}
                size={'2xl'}
                style={{ color: 'white' }}
              />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SetDetail;
