import { Outlet } from 'react-router-dom';
import { Box, Grid } from '@chakra-ui/react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { MobileNav } from './MobileNav';
import { Inspector } from '../inspector/Inspector';

// 3-pane IDE shell. Mirrors the prototype's grid:
//   .app        → rows 52px (top) / 1fr (workspace) / 28px (status)
//   .workspace  → cols 205px (side) / minmax(0,1fr) (center) / 300px (inspector)
// The center column scrolls; sidebar/inspector/status are fixed. Below md the
// sidebar hides and a mobile bottom nav appears; below xl the inspector hides.
// `pb` on the center area reserves space for the mobile nav so content isn't
// covered.
export const MainLayout = () => (
  <Grid
    h="100dvh"
    gridTemplateRows={{ base: '52px 1fr 0', md: '52px 1fr 28px' }}
    bg="sovereign.bg"
    color="sovereign.text"
    overflow="hidden"
  >
    <Box gridArea="1 / 1 / 2 / 2">
      <Topbar />
    </Box>

    <Grid
      gridArea="2 / 1 / 3 / 2"
      templateColumns={{
        base: '1fr',
        md: '205px minmax(0,1fr)',
        lg: '205px minmax(0,1fr)',
        xl: '205px minmax(0,1fr) 300px',
      }}
      minH={0}
    >
      <Sidebar />

      <Box
        as="main"
        minW={0}
        overflowY="auto"
        pb={{ base: '76px', md: 0 }}
        background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.06), transparent 36%), sovereign.bg"
      >
        <Box maxW="container.xl" mx="auto" p={{ base: '18px 14px', md: '24px' }} minH="100%">
          <Outlet />
        </Box>
      </Box>

      <Inspector />
    </Grid>

    <Box gridArea="3 / 1 / 4 / 2">
      <StatusBar />
    </Box>

    <MobileNav />
  </Grid>
);
