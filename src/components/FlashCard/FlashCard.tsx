import styles from './FlashCard.module.css';
import {useState} from "react";
import {Card} from "../../models/Card";

interface FlashCardProps {
  card: Card;
}

const FlashCard = ({ card }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  console.log(card);
  const flippingCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.flipCard} onClick={flippingCard}>
      <div className={`${styles.flipCardInner} ${isFlipped ? styles.flipping : ''}`}>
        <div className={styles.flipCardFront}>
          <div className={'h-full flex items-center justify-center text-xl p-5'}>
            {card.front}
          </div>
        </div>
        <div className={styles.flipCardBack}>
          <div className={'h-full flex items-center justify-center text-xl p-5 overflow-auto'}>
            {card.back}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashCard;