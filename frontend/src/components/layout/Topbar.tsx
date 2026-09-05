import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Text, Input, Button, IconButton } from '@chakra-ui/react';
import { useAuthStore } from '../../stores/authStore';
import { useRuntimeTruth } from '../../stores/runtimeTruth';
import { TruthPill } from '../ui/TruthPill';

// Top bar of the 3-pane shell. Mirrors the prototype's <header class="top">:
// brand, project selector, global search (⌘K), backend-truth pill, approvals,
// auth, and a mobile menu shortcut. Data-backed controls (project selector,
// approvals count) are wired in their respective phases; until then they
// render their honest empty default rather than fabricated state.
export const Topbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const truth = useRuntimeTruth();

  const searchTargets = [
    'projects',
    'missions',
    'code',
    'terminal',
    'browser',
    'memory',
    'skills',
    'mcp',
    'schedules',
    'security',
    'settings',
  ];

  return (
    <Flex
      as="header"
      h="52px"
      align="center"
      gap="10px"
      px={{ base: '10px', md: '14px' }}
      borderBottom="1px solid"
      borderColor="sovereign.line"
      bg="#0b0e12"
      zIndex={40}
      flexShrink={0}
    >
      <RouterLink
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          fontWeight: 900,
          minWidth: '150px',
          textDecoration: 'none',
          color: 'inherit',
        }}
        title="Back to CodingAgent.in"
      >
        <Box
          w="26px"
          h="26px"
          rounded="8px"
          bg="linear-gradient(135deg,#ff5a1f,#ff8a4c)"
          display="grid"
          placeItems="center"
          color="white"
          fontFamily="mono"
          fontWeight={900}
          fontSize="11px"
          flexShrink={0}
          aria-hidden
        >
          CA
        </Box>
        <Text fontWeight={900} fontSize="15px" display={{ base: 'none', md: 'block' }}>
          Coding
          <Text as="span" color="sovereign.accent">
            Agent
          </Text>
        </Text>
      </RouterLink>

      <Box
        as="select"
        aria-label="Project"
        h="34px"
        border="1px solid"
        borderColor="sovereign.line"
        bg="sovereign.panel"
        rounded="8px"
        px="10px"
        minWidth="210px"
        display={{ base: 'none', lg: 'block' }}
        disabled
      >
        <option value="">No project selected</option>
      </Box>

      <Box
        position="relative"
        flex={1}
        maxW="430px"
        mx="auto"
        display={{ base: 'none', md: 'block' }}
      >
        <Input
          aria-label="Search"
          placeholder="Search or command…"
          h="34px"
          bg="sovereign.panel"
          border="1px solid"
          borderColor="sovereign.line"
          rounded="8px"
          pr="35px"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const q = (e.target as HTMLInputElement).value.toLowerCase();
              const hit = searchTargets.find((x) => x.includes(q));
              if (hit) {navigate(`/${hit}`);}
            }
          }}
        />
        <Text
          position="absolute"
          right="10px"
          top="8px"
          color="sovereign.dim"
          fontFamily="mono"
          fontWeight={700}
          fontSize="10px"
          pointerEvents="none"
        >
          ⌘K
        </Text>
      </Box>

      <Flex gap="8px" ml="auto" align="center">
        <Box display={{ base: 'none', xl: 'block' }}>
          <TruthPill kind={truth.kind} label={truth.label} />
        </Box>

        <Button
          variant="ghost"
          size="sm"
          border="1px solid"
          borderColor="sovereign.line2"
          bg="sovereign.panel"
          rounded="8px"
          color="sovereign.text"
          fontWeight="750"
          fontSize="12px"
          h="34px"
          display={{ base: 'none', md: 'inline-flex' }}
          onClick={() => navigate('/missions')}
          _hover={{ borderColor: 'sovereign.accent' }}
        >
          Approvals <Text as="span" ml={1}>0</Text>
        </Button>

        {isAuthenticated ? (
          <>
            {user?.email && (
              <Text
                display={{ base: 'none', md: 'block' }}
                fontSize="xs"
                color="sovereign.muted"
                maxW="160px"
                isTruncated
              >
                {user.email}
              </Text>
            )}
            <Button
              size="sm"
              h="34px"
              variant="ghost"
              border="1px solid"
              borderColor="sovereign.line2"
              rounded="8px"
              color="sovereign.text"
              fontWeight="750"
              fontSize="12px"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              _hover={{ borderColor: 'sovereign.accent' }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            h="34px"
            variant="ghost"
            border="1px solid"
            borderColor="sovereign.line2"
            rounded="8px"
            color="sovereign.text"
            fontWeight="750"
            fontSize="12px"
            onClick={() => navigate('/login')}
            _hover={{ borderColor: 'sovereign.accent' }}
          >
            Sign in
          </Button>
        )}

        <IconButton
          aria-label="Open menu"
          icon={<Text>☰</Text>}
          variant="ghost"
          border="1px solid"
          borderColor="sovereign.line2"
          bg="sovereign.panel"
          rounded="8px"
          color="sovereign.text"
          h="34px"
          w="34px"
          minW="34px"
          display={{ base: 'inline-flex', md: 'none' }}
          onClick={() => navigate('/settings')}
        />
      </Flex>
    </Flex>
  );
};
