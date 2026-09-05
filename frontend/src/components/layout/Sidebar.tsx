import { NavLink } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Heading,
  Circle,
  Flex,
} from '@chakra-ui/react';
import { useEventStream } from '../../realtime/useEventStream';
import { useAuthStore } from '../../stores/authStore';
import { NAV_SECTIONS } from './navItems';

// Left nav of the 3-pane shell. Mirrors the prototype's <aside class="side">:
// four labeled sections (COMMAND / WORKSPACE / INTELLIGENCE / INFRASTRUCTURE)
// over the twelve nav items, with a realtime-status indicator and signed-in
// user badge at the foot. The realtime pill reuses the verified SSE singleton
// so the indicator stays consistent across every route.
export const Sidebar = () => {
  const { connected } = useEventStream();

  return (
    <Box
      as="nav"
      aria-label="Primary"
      w={{ base: '185px', lg: '205px' }}
      borderRight="1px solid"
      borderColor="sovereign.line"
      bg="#0b0e12"
      h="100%"
      overflowY="auto"
      py="10px"
      flexShrink={0}
      display={{ base: 'none', md: 'block' }}
    >
      <Heading
        size="sm"
        mb={6}
        color="sovereign.accent"
        fontSize="15px"
        fontWeight={900}
        px={4}
      >
        Coding
        <Text as="span" color="sovereign.text">
          Agent
        </Text>
      </Heading>

      {NAV_SECTIONS.map((section) => (
        <Box key={section.label} mb={1}>
          <Text
            fontSize="9px"
            fontFamily="mono"
            fontWeight={800}
            color="#46545d"
            letterSpacing="0.18em"
            px="12px"
            pt="10px"
            pb="5px"
          >
            {section.label}
          </Text>
          <VStack align="stretch" spacing={1}>
            {section.items.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 13px',
                  margin: '2px 7px',
                  borderRadius: '8px',
                  color: isActive ? '#ff5a1f' : '#8b99a4',
                  background: isActive ? 'rgba(255,90,31,0.11)' : 'transparent',
                  fontSize: '12px',
                  fontWeight: 650,
                  textDecoration: 'none',
                })}
              >
                <Text
                  as="span"
                  w="18px"
                  textAlign="center"
                  fontFamily="mono"
                  fontSize="12px"
                  aria-hidden
                >
                  {item.glyph}
                </Text>
                {item.label}
                {item.countKey && (
                  <Text
                    as="span"
                    ml="auto"
                    fontFamily="mono"
                    fontWeight={700}
                    fontSize="9px"
                    px="6px"
                    py="2px"
                    border="1px solid"
                    borderColor="sovereign.line"
                    rounded="full"
                  >
                    0
                  </Text>
                )}
              </NavLink>
            ))}
          </VStack>
        </Box>
      ))}

      <Box mt={8} pt={4} borderTop="1px solid" borderColor="sovereign.line" px={4}>
        <Text
          fontSize="9px"
          fontFamily="mono"
          fontWeight={800}
          color="sovereign.dim"
          textTransform="uppercase"
          letterSpacing="0.18em"
        >
          Realtime
        </Text>
        <Flex align="center" gap={2} mt={2}>
          <Circle
            size="8px"
            bg={connected ? 'sovereign.good' : 'sovereign.dim'}
            flexShrink={0}
          />
          <Text
            fontSize="xs"
            color={connected ? 'sovereign.good' : 'sovereign.dim'}
          >
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated || !user) {
    return null;
  }
  return (
    <Box mt={8} px={4}>
      <Text fontSize="9px" fontFamily="mono" color="sovereign.dim">
        Signed in
      </Text>
      <Text
        fontSize="xs"
        color="#c2ccd2"
        isTruncated
        title={user.email}
      >
        {user.email}
      </Text>
    </Box>
  );
};
