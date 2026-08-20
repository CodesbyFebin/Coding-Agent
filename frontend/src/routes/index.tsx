import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { AuthWrapper } from '../components/AuthWrapper';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';

// Main layout component (no auth logic here)
export const MainLayout = () => {
  return (
    <Box minH="100vh" bg="gray.50" color="gray.900">
      <Flex>
        {/* Sidebar */}
        <Box 
          w={200} 
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
        >
          <Text fontWeight="bold" fontSize="xl" mb={6}>
            CodingAgent
          </Text>
          <Button 
            w="full" 
            variant="outline" 
            mb={4}
            onClick={() => {
              // We'll implement workspace navigation later
              // For now, just console log
              console.log('Navigate to workspaces');
            }}
          >
            Workspaces
          </Button>
          <Button 
            w="full" 
            variant="outline" 
            mb={4}
            onClick={() => {
              console.log('Navigate to missions');
            }}
          >
            Missions
          </Button>
          <Button 
            w="full" 
            variant="outline" 
            mb={4}
            onClick={() => {
              console.log('Navigate to analytics');
            }}
          >
            Analytics
          </Button>
        </Box>

        {/* Main Content */}
        <Box 
          ml={200} 
          p={6} 
          w="full" 
          minH="100vh"
        >
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

// Routes definition
export const Routes = () => {
  return (
    <MainLayout>
      {/* Public routes (redirect if authenticated) */}
      <AuthWrapper redirectIfAuthenticated>
        <Navigate index to="/login" replace />
      </AuthWrapper>
      
      <AuthWrapper redirectIfAuthenticated>
        <Navigate path="/login" element={<LoginPage />} replace />
      </AuthWrapper>
      
      <AuthWrapper redirectIfAuthenticated>
        <Navigate path="/register" element={<RegisterPage />} replace />
      </AuthWrapper>
      
      {/* Protected routes (require authentication) */}
      <AuthWrapper>
        {/* Workspace routes */}
        <Navigate index to="/workspaces" replace />
        <Route 
          path="/workspaces" 
          element={<WorkspaceListPage />} 
        />
        <Route 
          path="/workspaces/new" 
          element={<NewWorkspacePage />} 
        />
        <Route 
          path="/workspaces/:workspaceId" 
          element={<WorkspaceOverviewPage />} 
        />
        
        {/* Mission routes */}
        <Route 
          path="/workspaces/:workspaceId/missions" 
          element={<MissionListPage />} 
        />
        <Route 
          path="/workspaces/:workspaceId/missions/new" 
          element={<NewMissionPage />} 
        />
        <Route 
          path="/workspaces/:workspaceId/missions/:missionId" 
          element={<MissionDetailPage />} 
        />
        
        {/* Analytics route */}
        <Route 
          path="/analytics" 
          element={<AnalyticsPage />} 
        />
      </AuthWrapper>
      
      {/* Not found */}
      <Route path="*" element={<NotFoundPage />} />
    </MainLayout>
  );
};

// Placeholder components (will be implemented later)
const WorkspaceListPage = () => <Text>Workspace List Page (Coming Soon)</Text>;
const NewWorkspacePage = () => <Text>New Workspace Page (Coming Soon)</Text>;
const WorkspaceOverviewPage = () => <Text>Workspace Overview Page (Coming Soon)</Text>;
const MissionListPage = () => <Text>Mission List Page (Coming Soon)</Text>;
const NewMissionPage = () => <Text>New Mission Page (Coming Soon)</Text>;
const MissionDetailPage = () => <Text>Mission Detail Page (Coming Soon)</Text>;
const NotFoundPage = () => <Text>404 - Page Not Found</Text>;
const AnalyticsPage = () => <Text>Analytics Page (Coming Soon)</Text>;

// Import Route from react-router-dom
import { Route } from 'react-router-dom';
