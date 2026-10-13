import React from 'react';
import { AppointmentStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus | string;
}

export const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status }) => {
  let variant: BadgeVariant = 'neutral';

  switch (status) {
    case 'Confirmed':
      variant = 'success';
      break;
    case 'Pending':
      variant = 'warning';
      break;
    case 'Cancelled':
      variant = 'danger';
      break;
    case 'Completed':
      variant = 'teal';
      break;
    default:
      variant = 'neutral';
  }

  return <Badge variant={variant}>{status}</Badge>;
};
