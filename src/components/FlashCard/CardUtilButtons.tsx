import React, { useState } from 'react';
import EditFlashcard from '../Modals/EditFlashcard';
import { EditOutlined, StarOutlined } from '@ant-design/icons';
import { Card } from '../../models/Card';
import { useSelector } from 'react-redux';
import { selectSetId } from '../../features/main-page/selector';
interface CardUtilButtonsProps {
  card: Card;
}
const CardUtilButtons = ({ card }: CardUtilButtonsProps) => {
  const [openModal, setOpenModal] = useState(false);
  const setId = useSelector(selectSetId);

  return (
    <div className={'w-full h-full flex justify-end'}>
      <EditFlashcard card={card} open={openModal} setOpen={setOpenModal} />
      <EditOutlined
        className={'text-lg'}
        onClick={() => setOpenModal(!openModal)}
      />
      {setId && (
        <div className={'pl-3'}>
          <StarOutlined className={'text-lg'} />
        </div>
      )}
    </div>
  );
};

export default CardUtilButtons;
