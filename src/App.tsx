import MenuBar from './components/MenuBar';
import WallpaperUrl from './assets/wallpaper.jpg';
import Dock from '@/components/Dock';
import AppProvider from '@/store/App/AppProvider';
import WindowWrapper from '@/components/AppWindow/WindowWrapper';
import OverlayProvider from './store/Overlay/OverlayProvider';
import SystemProvider from './store/System/SystemProvider';
import { useContext } from 'react';
import { SystemStateContext } from './store/System/SystemContext';
import useWindowResize from './hooks/useWindowResize';

function App() {
  return (
    <SystemProvider>
      <AppProvider>
        <OverlayProvider>
          <ResponsiveScreen />
        </OverlayProvider>
      </AppProvider>
    </SystemProvider>
  );
}

const ResponsiveScreen = () => {
  const isAvailableWindowSize = useWindowResize();
  return isAvailableWindowSize ? <Desktop /> : <Mobile />;
};

const Desktop = () => {
  const { brightness } = useContext(SystemStateContext);
  return (
    <div
      className='h-screen w-full'
      style={{
        filter: `brightness(${brightness}%)`,
      }}
    >
      <img src={WallpaperUrl} className='absolute h-full w-full object-cover' />
      <MenuBar />
      <WindowWrapper />
      <Dock />
    </div>
  );
};

const Mobile = () => {
  return (
    <div>
      <h1>앱이 지원하지 않는 스크린 사이즈입니다.</h1>
      <p>최소 넓이: 1024px, 최소 높이: 768px</p>
    </div>
  );
};

export default App;
