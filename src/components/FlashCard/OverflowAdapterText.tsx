import { useEffect, useRef, useState } from 'react';
import { TextSize } from '../../enums';

interface OverflowAdapterTextProps {
  text?: string;
  textSize?: TextSize;
}

const OverflowAdapterText = ({ text, textSize }: OverflowAdapterTextProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const frontTextRef = useRef<any>();

  useEffect(() => {
    const checkOverflow = () => {
      if (frontTextRef.current) {
        if (
          // frontTextRef.current.scrollWidth > frontTextRef.current.clientWidth ||
          frontTextRef.current.scrollHeight > frontTextRef.current.clientHeight
        ) {
          console.log('overflow', text?.[0]);
          setIsOverflowing(true);
        } else {
          console.log('not-overflow', text?.[0]);
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  });

  return (
    <p
      className={`flex overflow-auto ${textSize} ${
        isOverflowing ? 'items-start' : 'items-center justify-center'
      } h-full pr-3 break-words whitespace-pre-wrap tracking-wide leading-8`}
      ref={frontTextRef}
    >
      {text}
    </p>
  );
};

export default OverflowAdapterText;
