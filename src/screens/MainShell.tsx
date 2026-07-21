import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MainTab } from '../components/ui';
import { Project, Task } from '../data/marketplace';
import BidAcceptedScreen from './BidAcceptedScreen';
import BrowseTasksScreen from './BrowseTasksScreen';
import MyBidsScreen from './MyBidsScreen';
import MyProjectsScreen from './MyProjectsScreen';
import PlaceBidScreen from './PlaceBidScreen';
import ProfileScreen from './ProfileScreen';
import StudentDashboardScreen from './StudentDashboardScreen';
import SubmitWorkScreen from './SubmitWorkScreen';
import TaskDetailScreen from './TaskDetailScreen';

type Route =
  | { name: 'home' }
  | { name: 'browseTasks' }
  | { name: 'taskDetail'; task: Task }
  | { name: 'placeBid'; task: Task }
  | { name: 'bidAccepted'; task: Task }
  | { name: 'projects' }
  | { name: 'submitWork'; project: Project }
  | { name: 'myBids' }
  | { name: 'profile' };

const ROOT: Record<MainTab, Route> = {
  home: { name: 'home' },
  tasks: { name: 'browseTasks' },
  bids: { name: 'myBids' },
  profile: { name: 'profile' },
};

type Props = {
  name: string;
  email: string;
  walletAddress?: string;
  /** Leaves the shell to run the profile-setup wizard again. */
  onEditProfile: () => void;
};

/** Tabbed authenticated experience: Home, Tasks, Bids and Profile, each with
 *  its own drill-in stack (task detail, bidding, submitting work). */
export default function MainShell({
  name,
  email,
  walletAddress,
  onEditProfile,
}: Props) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const current = stack[stack.length - 1];

  const push = useCallback((route: Route) => {
    setStack((s) => [...s, route]);
  }, []);

  const pop = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const switchTab = useCallback((tab: MainTab) => {
    setStack([ROOT[tab]]);
  }, []);

  const commonProps = { name, email, walletAddress };

  return (
    <View style={styles.container}>
      {current.name === 'home' && (
        <StudentDashboardScreen
          {...commonProps}
          onImproveProfile={onEditProfile}
          onBrowseTasks={() => push({ name: 'browseTasks' })}
          onOpenBids={() => switchTab('bids')}
          onTab={switchTab}
        />
      )}

      {current.name === 'browseTasks' && (
        <BrowseTasksScreen
          onOpenTask={(task) => push({ name: 'taskDetail', task })}
          onTab={switchTab}
        />
      )}

      {current.name === 'taskDetail' && (
        <TaskDetailScreen
          task={current.task}
          onBack={pop}
          onPlaceBid={() => push({ name: 'placeBid', task: current.task })}
        />
      )}

      {current.name === 'placeBid' && (
        <PlaceBidScreen
          onBack={pop}
          onSubmit={() =>
            setStack((s) => [...s.slice(0, -1), { name: 'bidAccepted', task: current.task }])
          }
        />
      )}

      {current.name === 'bidAccepted' && (
        <BidAcceptedScreen
          task={current.task}
          onGoToTask={() => setStack([{ name: 'projects' }])}
          onViewProjects={() => setStack([{ name: 'projects' }])}
        />
      )}

      {current.name === 'projects' && (
        <MyProjectsScreen
          onOpenProject={(project) => push({ name: 'submitWork', project })}
          onTab={switchTab}
        />
      )}

      {current.name === 'submitWork' && (
        <SubmitWorkScreen onBack={pop} onSubmit={() => setStack([{ name: 'projects' }])} />
      )}

      {current.name === 'myBids' && <MyBidsScreen onTab={switchTab} />}

      {current.name === 'profile' && (
        <ProfileScreen
          {...commonProps}
          onEditProfile={onEditProfile}
          onTab={switchTab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
