import React, { useState } from 'react';
import EditFlashcard from '../Modals/EditFlashcard';
import { Card } from '../../models/Card';
import { useSelector } from 'react-redux';
import { selectSetId } from '../../features/main-page/selector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEdit } from '@fortawesome/free-regular-svg-icons';

interface CardUtilButtonsProps {
  card: Card;
}
const CardUtilButtons = ({ card }: CardUtilButtonsProps) => {
  const [openModal, setOpenModal] = useState(false);
  const setId = useSelector(selectSetId);

  return (
    <div className={'w-full h-full flex justify-end'}>
      <EditFlashcard card={card} open={openModal} setOpen={setOpenModal} />
      <div>
        <FontAwesomeIcon
          icon={faEdit}
          size={'lg'}
          className={'hover:text-yellow-300'}
          onClick={() => setOpenModal(!openModal)}
        />
      </div>
      {setId && (
        <div className={'pl-4'}>
          <FontAwesomeIcon icon={faStar} size={'lg'} />
        </div>
      )}
    </div>
  );
};

export default CardUtilButtons;
