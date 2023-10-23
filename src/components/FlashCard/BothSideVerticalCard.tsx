import styles from './FlashCard.module.scss';
import OverflowAdapterText from './OverflowAdapterText';
import { Divider } from 'antd';
import CardUtilButtons from './CardUtilButtons';
import React from 'react';
import { Card } from '../../models/Card';
import { TextSize } from '../../enums';

interface BothSideDisplayProps {
  card: Card;
}

const BothSideVerticalCard = ({ card }: BothSideDisplayProps) => {
  return (
    <div className={`w-full h-full`}>
      <div className={'h-full'}>
        <div className={styles.flipCardFront}>
          <div className={'w-full h-[8%] mb-3'}>
            <CardUtilButtons card={card} />
          </div>
          <div className={'h-2/5'}>
            <OverflowAdapterText text={card?.front} textSize={TextSize.LARGE} />
          </div>
          <Divider className={'h-1 my-2.5 bg-gray-600'} />
          <div className={'h-2/5'}>
            <OverflowAdapterText text={card?.back} textSize={TextSize.LARGE} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BothSideVerticalCard;
