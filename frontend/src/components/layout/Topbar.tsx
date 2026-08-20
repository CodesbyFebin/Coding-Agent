import { useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const Topbar = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Flex
      as="header"
      h="56px"
      align="center"
      justify="space-between"
      px={6}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={5}
    >
      <Text fontSize="sm" color="gray.500">
        Agentic Engineering Command Center
      </Text>
      <Box display="flex" alignItems="center" gap={3}>
        <Text fontSize="sm" color="gray.700" isTruncated maxW="220px">
          {user?.email ?? ''}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<LogOut size={16} />}
          onClick={handleLogout}
          aria-label="Log out"
        >
          Log out
        </Button>
      </Box>
    </Flex>
  );
};
