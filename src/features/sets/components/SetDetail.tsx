import FlashCard from '../../../components/FlashCard/FlashCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadingSet } from '../reducer';
import { useParams } from 'react-router-dom';
import { selectCardsInSet } from '../selector';
import { CardDisplayState, TextSize } from '../../../enums';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const SetDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const cards = useSelector(selectCardsInSet);

  const [currentId, setCurrentId] = useState(0);
  const [displayCards, setDisplayCards] = useState<any[]>([]);

  useEffect(() => {
    dispatch(loadingSet(id));
  }, []);

  useEffect(() => {
    setDisplayCards([
      { id: 0, className: 'pt-10 w-full swipe', card: cards[0] },
      { id: 1, className: 'pt-10 swipe swipe-right', card: cards[1] },
    ]);
  }, [cards]);
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
    <div className={'w-full'}>
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
                textSize={TextSize.XL}
              />
            )}
          </div>
        ))}
      </div>
      <div className={'flex justify-center w-full pt-3 pb-5'}>
        <Button
          size={'large'}
          shape={'circle'}
          className={`text-white border-gray-600 border-2 japan-red-dot ${
            currentId === 0 ? 'cursor-default opacity-0' : ''
          }`}
          onClick={clickBack}
        >
          <ArrowLeftOutlined />
        </Button>
        <div className={'w-10'} />
        <Button
          size={'large'}
          shape={'circle'}
          className={`text-white border-gray-600 border-2 japan-red-dot ${
            currentId === cards.length - 1 ? 'cursor-default opacity-0' : ''
          }`}
          onClick={clickNext}
        >
          <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default SetDetail;
