import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { MyJobScreen } from './MyJobScreen';
import { CalendarScreen } from './CalendarScreen';
import { SafetyGrowthScreen } from './SafetyGrowthScreen';
import { CameraViewfinder } from './CameraViewfinder';

type Tab = 'my-job' | 'calendar' | 'safety';

export function EmployeePortal() {
  const [activeTab, setActiveTab] = useState<Tab>('my-job');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleTabChange = (tab: Tab) => {
    if (tab === 'calendar') {
      // Open camera instead of calendar
      setIsCameraOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A'
    }}>
      {/* Tab Content */}
      {activeTab === 'my-job' && <MyJobScreen />}
      {activeTab === 'calendar' && <CalendarScreen />}
      {activeTab === 'safety' && <SafetyGrowthScreen />}

      {/* Camera Viewfinder */}
      {isCameraOpen && (
        <CameraViewfinder onClose={() => setIsCameraOpen(false)} />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}