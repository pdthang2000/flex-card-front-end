import FlashCard from '../../../components/FlashCard/FlashCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CardDisplayState, TextSize } from '../../../enums';
import { Button, Col, Dropdown, Row } from 'antd';
import {
  clearSetState,
  loadingSet,
  shufflingCardList,
  unShufflingCardList,
} from '../../cards/reducer';
import {
  selectCardList,
  selectCardListLoading,
  selectSetInformation,
} from '../../cards/selector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faShuffle,
  faGear,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { useLoadingContext } from '../../../contexts/LoadingContext';
import DeleteSetButton from './DeleteSetButton';

const SetDetail = () => {
  const dispatch = useDispatch();

  const { showLoading, hideLoading } = useLoadingContext();

  const { setId } = useParams();

  const cards = useSelector(selectCardList);
  const setInformation = useSelector(selectSetInformation);
  const loading = useSelector(selectCardListLoading);

  const [currentId, setCurrentId] = useState<number>(0);
  const [displayCards, setDisplayCards] = useState<any[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    dispatch(loadingSet(setId));
    return () => {
      dispatch(clearSetState());
    };
  }, []);

  useEffect(() => {
    if (loading || cards.length === 0) {
      return;
    }
    if (displayCards.length === 0) {
      setDisplayCards([
        {
          id: 0,
          cardId: cards[0]?.id,
          className: `w-full swipe`,
          card: cards[0],
        },
        {
          id: 1,
          cardId: cards[1]?.id,
          className: `swipe swipe-right`,
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
  }, [cards]);

  const shuffling = () => {
    if (isShuffle) {
      dispatch(unShufflingCardList());
    } else {
      dispatch(shufflingCardList());
    }
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
        className: `swipe swipe-left`,
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
    currentCards[0].className = currentCards[0].className.replace(
      'w-full ',
      '',
    );

    currentCards[1].className = currentCards[1].className.replace(
      'swipe-right',
      'w-full',
    );

    if (currentCards[currentCards.length - 1].id + 1 !== cards.length) {
      currentCards.push({
        id: currentCards[currentCards.length - 1].id + 1,
        className: `swipe swipe-right`,
        card: cards[currentCards[currentCards.length - 1].id + 1],
      });
    }
    setCurrentId(currentId + 1);
    setDisplayCards(currentCards);
  };

  const items = useMemo(
    () => [
      {
        key: '1',
        label: setId ? <DeleteSetButton setId={setId} /> : <></>,
      },
    ],
    [setId],
  );

  if (loading) {
    return <></>;
  }
  return (
    <div className={'w-4/5 pl-10 pb-10'}>
      <p className={'text-white text-3xl py-3'}>{setInformation.title}</p>
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
                textSize={TextSize.XXXL}
              />
            )}
          </div>
        ))}
      </div>
      {cards.length !== 0 && (
        <Row className={'pt-3'}>
          <Col span={8}>
            <div className={'w-fit'}>
              <Link to={'./edit'}>
                <Button
                  shape={'circle'}
                  className={`japan-red-dot border-2 
                            border-gray-600 w-14 h-14 mr-5`}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={'xl'}
                    style={{ color: 'white' }}
                  />
                </Button>
              </Link>
            </div>
          </Col>
          <Col span={8}>
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
              <div className={'japan-red-dot w-16 text-white text-xl'}>
                {currentId + 1} / {setInformation.cardCount}
              </div>
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
          <Col span={8} className={'flex justify-end'}>
            <Dropdown
              placement={'bottom'}
              menu={{ items }}
              overlayClassName={'custom-dropdown'}
            >
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
            </Dropdown>
            <Button
              shape={'circle'}
              className={`japan-red-dot w-14 h-14 ${
                isShuffle
                  ? 'border-4 border-gray-400'
                  : 'border-2 border-gray-600'
              }`}
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
