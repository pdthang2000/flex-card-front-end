import React, { useState } from 'react';
import EditFlashcard from '../Modals/EditFlashcard';
import { EditOutlined, StarOutlined } from '@ant-design/icons';
import { Card } from '../../models/Card';
interface CardUtilButtonsProps {
  card: Card;
}
const CardUtilButtons = ({ card }: CardUtilButtonsProps) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={'flex justify-end pb-5'}>
      <EditFlashcard card={card} open={openModal} setOpen={setOpenModal} />
      <EditOutlined
        className={'text-lg pr-5'}
        onClick={() => setOpenModal(!openModal)}
      />
      <StarOutlined className={'text-lg'} />
    </div>
  );
};

export default CardUtilButtons;
