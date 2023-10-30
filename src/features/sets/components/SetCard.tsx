import { Sett } from '../../../models/Sett';

interface SetCardI {
  set: Sett;
}

const SetCard = ({ set }: SetCardI) => {
  return (
    <div
      className={
        'p-3 text-white h-full bg-sub-main w-full rounded-md cursor-pointer'
      }
    >
      <div className={'text-md'}>{set.cardCount} cards</div>
      <div className={'h-0.5 my-1 w-full bg-gray-700'} />
      <div className={'text-xl hover:text-yellow-400'}>{set.title}</div>
    </div>
  );
};

export default SetCard;
