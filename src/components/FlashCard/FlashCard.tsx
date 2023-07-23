import styles from './FlashCard.module.css';
import {useState} from "react";

const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flippingCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.flipCard} onClick={flippingCard}>
      <div className={`${styles.flipCardInner} ${isFlipped ? styles.flipping : ''}`}>
        <div className={styles.flipCardFront}>
          <div className={'h-full flex items-center justify-center text-xl'}>
            Word
          </div>
        </div>
        <div className={styles.flipCardBack}>
          <div className={'h-full flex items-center justify-center text-xl'}>
            Meaning
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashCard;