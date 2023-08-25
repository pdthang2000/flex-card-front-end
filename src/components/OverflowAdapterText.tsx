import { useEffect, useRef, useState } from 'react';

interface OverflowAdapterTextProps {
  text?: string;
}

const OverflowAdapterText = ({ text }: OverflowAdapterTextProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const frontTextRef = useRef<any>();

  useEffect(() => {
    const checkOverflow = () => {
      if (frontTextRef.current) {
        if (
          frontTextRef.current.scrollWidth > frontTextRef.current.clientWidth ||
          frontTextRef.current.scrollHeight > frontTextRef.current.clientHeight
        ) {
          setIsOverflowing(true);
        } else {
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <p
      className={`flex ${
        isOverflowing ? 'items-baseline' : 'items-center'
      } justify-center h-full overflow-auto 
        text-lg p-5 break-words whitespace-pre-wrap`}
      ref={frontTextRef}
    >
      {text}
    </p>
  );
};

export default OverflowAdapterText;
