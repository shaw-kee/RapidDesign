import WifiIcon from '@/assets/icons/WifiIcon.svg?react';
import CommunicationButton from './CommunicationButton';
import ControlCenterItem from './ControlCenterItem';
import Slider from './Slider';
import { useContext } from 'react';
import { SystemReducerContext, SystemStateContext } from '@/store/System/SystemContext';

const ControlCenter = () => {
  const { sound, brightness } = useContext(SystemStateContext);
  const dispatch = useContext(SystemReducerContext);

  if (!dispatch) throw new Error('dispatch is null');

  return (
    <div className='gal-2 flex w-80 flex-col gap-2 [&_*]:gap-2'>
      <div className='flex [&>*]:flex-1'>
        <div>
          <ControlCenterItem>
            <CommunicationButton icon={<WifiIcon width={16} height={11} viewBox='0 0 16 11' />} name='Wi-Fi' />
            <CommunicationButton icon={<WifiIcon width={16} height={11} viewBox='0 0 16 11' />} name='Bluetooth' />
            <CommunicationButton icon={<WifiIcon width={16} height={11} viewBox='0 0 16 11' />} name='AirDrop' />
          </ControlCenterItem>
        </div>
        <div className='flex flex-col [&>*]:flex-1'>
          <ControlCenterItem>
            <CommunicationButton
              icon={<WifiIcon width={16} height={11} viewBox='0 0 16 11' />}
              name='Focus'
              showDescription={false}
            />
          </ControlCenterItem>
          <div className='flex h-full items-center text-[10px]'>
            <ControlCenterItem>Stage Manager</ControlCenterItem>
            <ControlCenterItem>Screen Mirroring</ControlCenterItem>
          </div>
        </div>
      </div>

      <ControlCenterItem>
        <div>Display</div>
        <Slider
          value={brightness}
          onChange={(event) => dispatch({ type: 'SET_BRIGHTNESS', value: Number(event.target.value) })}
        />
      </ControlCenterItem>

      <ControlCenterItem>
        <div>Sound</div>
        <Slider
          value={sound}
          onChange={(event) => dispatch({ type: 'SET_SOUND', value: Number(event.target.value) })}
        />
      </ControlCenterItem>

      <ControlCenterItem>Music</ControlCenterItem>
    </div>
  );
};
export default ControlCenter;