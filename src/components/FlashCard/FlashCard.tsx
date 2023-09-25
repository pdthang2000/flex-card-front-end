import styles from './FlashCard.module.scss';
import { useEffect, useState } from 'react';
import { Card } from '../../models/Card';
import { CardDisplayState } from '../../enums';
import OverflowAdapterText from '../OverflowAdapterText';
import { Button, Dropdown, MenuProps } from 'antd';
import BothSideDisplay from '../BothSideDisplay';
import { MoreOutlined } from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    key: '2',
    label: <div>2nd menu item</div>,
  },
  {
    key: '3',
    label: <div>2nd menu item</div>,
  },
];

interface FlashCardProps {
  card: Card;
  state?: CardDisplayState;
}

const FlashCard = ({ card, state }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (state === CardDisplayState.FRONT) {
      setIsFlipped(false);
    }
    if (state === CardDisplayState.BACK) {
      setIsFlipped(true);
    }
  }, [state]);

  const onCardClick = (e: any) => {
    if (e.target.localName !== 'p') {
      return;
    }
    if (state !== CardDisplayState.BOTH) {
      setIsFlipped(!isFlipped);
    }
    return;
  };

  return (
    <div className={'relative'}>
      {!state || state !== CardDisplayState.BOTH ? (
        <div className={styles.flipCard} onClick={onCardClick}>
          <div
            className={`${styles.flipCardInner}
              ${isFlipped ? styles.flipping : ''}`}
          >
            <div className={styles.flipCardFront}>
              <div className={'flex justify-end'}>
                <Dropdown menu={{ items }} placement="bottomLeft">
                  <Button
                    className={
                      'flex items-center justify-center text-white text-xl'
                    }
                    shape={'circle'}
                    type={'text'}
                  >
                    <MoreOutlined />
                  </Button>
                </Dropdown>
              </div>
              <div className={'h-full -mt-8'}>
                <OverflowAdapterText text={card.front} />
              </div>
            </div>
            <div className={styles.flipCardBack}>
              <div className={'p-2 h-full'}>
                <OverflowAdapterText text={card.back} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <BothSideDisplay front={card.front} back={card.back} />
      )}
    </div>
  );
};

export default FlashCard;
