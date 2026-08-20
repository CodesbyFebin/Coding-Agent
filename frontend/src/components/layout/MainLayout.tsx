import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const MainLayout = () => (
  <Flex minH="100vh" bg="gray.50" color="gray.900">
    <Sidebar />
    <Flex direction="column" flex={1} ml={{ base: 0, md: '220px' }} w="full">
      <Topbar />
      <Box as="main" flex={1} p={6} w="full" maxW="container.xl" mx="auto">
        <Outlet />
      </Box>
    </Flex>
  </Flex>
);
