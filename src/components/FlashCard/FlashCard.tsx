import styles from './FlashCard.module.scss';
import React, { useEffect, useState } from 'react';
import { Card } from '../../models/Card';
import { CardDisplayState, TextSize } from '../../enums';
import OverflowAdapterText from './OverflowAdapterText';
import BothSideDisplay from './BothSideDisplay';
import CardUtilButtons from './CardUtilButtons';

interface FlashCardProps {
  card: Card;
  state?: CardDisplayState;
  textSize?: TextSize;
}

const FlashCard = ({
  card,
  state,
  textSize = TextSize.MEDIUM,
}: FlashCardProps) => {
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
    <div className={`relative h-full`}>
      {!state || state !== CardDisplayState.BOTH ? (
        <div className={styles.flipCard} onClick={onCardClick}>
          <div
            className={`${styles.flipCardInner}
              ${isFlipped ? styles.flipping : ''}`}
          >
            <div className={styles.flipCardFront}>
              <div className={'h-full pb-10'}>
                <CardUtilButtons card={card} />
                <OverflowAdapterText text={card?.front} textSize={textSize} />
              </div>
            </div>
            <div className={styles.flipCardBack}>
              <div className={'h-full pb-10'}>
                <CardUtilButtons card={card} />
                <OverflowAdapterText text={card?.back} textSize={textSize} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <BothSideDisplay front={card?.front} back={card?.back} />
      )}
    </div>
  );
};

export default FlashCard;
