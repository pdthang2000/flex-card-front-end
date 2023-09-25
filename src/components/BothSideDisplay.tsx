import styles from './FlashCard/FlashCard.module.scss';
import OverflowAdapterText from './OverflowAdapterText';
import { Divider } from 'antd';

interface BothSideDisplayProps {
  front?: string;
  back?: string;
}

const BothSideDisplay = ({ front, back }: BothSideDisplayProps) => {
  return (
    <div className={`${styles.flipCardBoth}`}>
      <div className={'p-2 h-full'}>
        <div className={styles.flipCardFront}>
          <div className={'p-2 h-1/2'}>
            <OverflowAdapterText text={front} />
          </div>
          <Divider className={'h-1 m-0 bg-gray-600'} />
          <div className={'p-2 h-1/2'}>
            <OverflowAdapterText text={back} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BothSideDisplay;
