import { BIDS, PROJECTS } from './marketplace';

export type NotificationKind = 'verification' | 'bid' | 'job' | 'payment';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
};

/**
 * Builds the notification feed from current app data: verification status,
 * approved bids, completed jobs and escrow payments. Grows automatically as
 * real activity lands.
 */
export function buildNotifications(verified: boolean): AppNotification[] {
  const items: AppNotification[] = [];

  if (verified) {
    items.push({
      id: 'verification',
      kind: 'verification',
      title: 'Verification successful',
      body: 'Your account and student details have been verified. You now have a verified badge.',
      time: 'Today',
    });
  }

  for (const bid of BIDS.filter((b) => b.status === 'Approved')) {
    items.push({
      id: `bid-${bid.id}`,
      kind: 'bid',
      title: 'Bid approved',
      body: `Your bid on ${bid.title} was approved by ${bid.client}.`,
      time: 'Today',
    });
  }

  for (const project of PROJECTS.filter((p) => p.status === 'Completed')) {
    items.push({
      id: `job-${project.id}`,
      kind: 'job',
      title: 'Job completed',
      body: `${project.title} for ${project.client} is complete.`,
      time: 'Earlier',
    });
    items.push({
      id: `payment-${project.id}`,
      kind: 'payment',
      title: 'Payment received',
      body: `$${project.budget.toFixed(2)} was released from escrow for ${project.title}.`,
      time: 'Earlier',
    });
  }

  return items;
}
