import SpotlightIcon from '@/assets/icons/SpotlightIcon.svg?react';
import { AppReducerContext, AppStateContext } from '@/store/App/AppContext';
import { useContext, useEffect, useRef, useState } from 'react';

type SpotlightProps = {
  close: () => void;
};

const Spotlight = ({ close }: SpotlightProps) => {
  const apps = useContext(AppStateContext);
  const dispatch = useContext(AppReducerContext);

  if (!dispatch) throw new Error('dispatch is null');

  const [suggestedApps, setSuggestedApps] = useState<typeof apps>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value.toLowerCase();
    if (keyword.trim() === '') {
      setSuggestedApps([]);
      return;
    }
    const selectedApps = apps.filter((app) => app.title.toLowerCase().includes(keyword));
    setSuggestedApps(selectedApps);
  };

  const handleClickApp = (id: (typeof apps)[number]['id']) => {
    dispatch({ type: 'OPEN', id });
    close();
    setSuggestedApps([]);
  };

  useEffect(() => {
    const handleClickAway = (event: Event) => {
      const divElement = ref.current;
      const isClickElementAway = event.target instanceof HTMLElement && !divElement?.contains(event.target);

      if (isClickElementAway) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickAway);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [close]);

  return (
    <div ref={ref} className='absolute left-1/2 top-[20%] z-50 -translate-x-1/2 transform'>
      <div className='popup-container flex w-[36rem] flex-col rounded-2xl p-2.5'>
        <div className='flex items-center gap-2'>
          <SpotlightIcon width={24} height={24} stroke='none' />
          <input
            placeholder='Spotlight Search'
            className='w-full bg-[rgba(255,_255,_255,_0)] text-[24px] outline-none'
            onChange={handleChangeInput}
          />
        </div>
        <ul className='space-y-2'>
          {suggestedApps.map(({ id, title }) => (
            <li key={id} className='select-none first-of-type:mt-2 hover:opacity-50' onClick={() => handleClickApp(id)}>
              {title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Spotlight;
