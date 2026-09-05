import { Flex, Text } from '@chakra-ui/react';
import { useAuthStore } from '../../stores/authStore';

// Bottom status bar (desktop only; hidden on mobile where MobileNav occupies
// the foot). Mirrors the prototype's <footer class="status"> line.
export const StatusBar = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Flex
      as="footer"
      align="center"
      gap={{ base: '10px', xl: '15px' }}
      px="10px"
      borderTop="1px solid"
      borderColor="sovereign.line"
      bg="#080b0f"
      color="sovereign.dim"
      fontFamily="mono"
      fontWeight={700}
      fontSize="9px"
      h="28px"
      overflow="hidden"
      whiteSpace="nowrap"
      display={{ base: 'none', md: 'flex' }}
    >
      <Text>{isAuthenticated ? '● AUTHENTICATED' : '● SIGNED OUT'}</Text>
      <Text>provider · unavailable</Text>
      <Text>mcp · unavailable</Text>
      <Text color="sovereign.accent2">cost · UNKNOWN</Text>
      <Text ml="auto" display={{ base: 'none', xl: 'block' }}>
        app.codingagent.in · authoritative backend required
      </Text>
    </Flex>
  );
};
