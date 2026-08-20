import { Badge } from '@chakra-ui/react';
import type { MissionStatus, VerificationStatus } from '../../types';

const MISSION_STATUS_COLORS: Record<MissionStatus, string> = {
  PENDING: 'gray',
  RUNNING: 'yellow',
  COMPLETED: 'green',
  FAILED: 'red',
  CANCELLED: 'gray',
};

const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  VERIFIED: 'green',
  UNVERIFIED: 'yellow',
  FAILED: 'red',
  PENDING: 'gray',
};

interface MissionStatusBadgeProps {
  status: MissionStatus;
}

export const MissionStatusBadge = ({ status }: MissionStatusBadgeProps) => (
  <Badge colorScheme={MISSION_STATUS_COLORS[status]} variant="subtle" textTransform="uppercase">
    {status}
  </Badge>
);

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
}

export const VerificationStatusBadge = ({ status }: VerificationStatusBadgeProps) => (
  <Badge
    colorScheme={VERIFICATION_STATUS_COLORS[status]}
    variant="subtle"
    textTransform="uppercase"
  >
    {status}
  </Badge>
);
