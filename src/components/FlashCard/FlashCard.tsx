import styles from './FlashCard.module.css';
import { useState } from 'react';
import { Card } from '../../models/Card';
import OverflowAdapterText from '../OverflowAdapterText';

interface FlashCardProps {
  card: Card;
}

const FlashCard = ({ card }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={styles.flipCard} onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={`${styles.flipCardInner} 
          ${isFlipped ? styles.flipping : ''}`}
      >
        <div className={styles.flipCardFront}>
          <div className={'p-2 h-full'}>
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
  );
};

export default FlashCard;
