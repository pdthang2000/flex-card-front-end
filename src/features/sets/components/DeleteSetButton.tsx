import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deletingSet } from '../../cards/reducer';
import React from 'react';

interface DeleteSetButtonProps {
  setId: string;
}
const DeleteSetButton = ({ setId }: DeleteSetButtonProps) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(deletingSet(setId));
  };

  return (
    <div className={'p-1 text-white hover:text-yellow-300'} onClick={onClick}>
      <FontAwesomeIcon icon={faTrash} className={'pr-3'} />
      Delete
    </div>
  );
};

export default DeleteSetButton;
