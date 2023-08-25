interface SetCardI {
  setName: string;
  totalCard: number;
}

const SetCard = ({ setName, totalCard }: SetCardI) => {
  return (
    <div
      className={
        'p-3 text-white h-full bg-black w-full rounded-xl cursor-pointer'
      }
    >
      <div className={'text-md'}>{totalCard} cards</div>
      <div className={'h-0.5 my-1 w-full bg-gray-700'} />
      <div className={'text-xl hover:text-yellow-400'}>{setName}</div>
    </div>
  );
};

export default SetCard;
