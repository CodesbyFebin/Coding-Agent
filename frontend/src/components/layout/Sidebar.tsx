import { NavLink } from 'react-router-dom';
import { Box, VStack, Text, Heading, Spinner, Circle, Flex } from '@chakra-ui/react';
import { useEventStream } from '../../realtime/useEventStream';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/workspaces', label: 'Workspaces' },
  { to: '/analytics', label: 'Analytics' },
];

export const Sidebar = () => {
  const { connected } = useEventStream();

  return (
    <Box
      as="nav"
      w="220px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      p={4}
      overflowY="auto"
      aria-label="Primary"
      zIndex={10}
    >
      <Heading size="md" mb={6} color="brand.500">
        Coding<span>Agent</span>
      </Heading>

      <VStack align="stretch" spacing={1}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              color: isActive ? '#ff5a1f' : '#4a5568',
              background: isActive ? '#fff5ed' : 'transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </VStack>

      <Box mt={8} pt={4} borderTop="1px solid" borderColor="gray.100">
        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
          Realtime
        </Text>
        <Flex align="center" gap={2} mt={2}>
          <Circle size="8px" bg={connected ? 'green.400' : 'gray.300'} />
          <Text fontSize="xs" color={connected ? 'green.600' : 'gray.500'}>
            {connected ? 'SSE connected' : 'SSE offline'}
          </Text>
        </Flex>
      </Box>

      <UserBadge />
    </Box>
  );
};

const UserBadge = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  if (loading) {
    return (
      <Box mt="auto" pt={4}>
        <Spinner size="sm" />
      </Box>
    );
  }
  if (!user) {return null;}
  return (
    <Box mt="auto" pt={4}>
      <Text fontSize="xs" color="gray.500">
        Signed in
      </Text>
      <Text fontSize="sm" color="gray.800" isTruncated title={user.email}>
        {user.email}
      </Text>
    </Box>
  );
};
