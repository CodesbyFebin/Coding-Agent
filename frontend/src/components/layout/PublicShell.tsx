import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Box, Flex, Text, Button, Container, VStack } from '@chakra-ui/react';
import { ALL_PILLARS } from '../../data/pillarsData';

// Public shell for the indexable knowledge surfaces (/pillars, per-pillar
// pages). Unlike the authed Command Center shell, these routes are reachable
// without authentication so search engines and answer engines can crawl the
// 80-pillar content. The header/footer mirror the reference marketing build's
// structure in the sovereign dark theme.
export const PublicShell = () => (
  <Box minH="100dvh" display="grid" gridTemplateRows="auto 1fr auto" bg="sovereign.bg" color="sovereign.text">
    <Flex
      as="header"
      h="52px"
      align="center"
      gap="10px"
      px={{ base: '10px', md: '14px' }}
      borderBottom="1px solid"
      borderColor="sovereign.line"
      bg="#0b0e12"
    >
      <RouterLink
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          fontWeight: 900,
          textDecoration: 'none',
          color: 'inherit',
        }}
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
          aria-hidden
        >
          CA
        </Box>
        <Text fontWeight={900} fontSize="15px">
          Coding
          <Text as="span" color="sovereign.accent">
            Agent
          </Text>
        </Text>
      </RouterLink>

      <Flex
        as="nav"
        aria-label="Knowledge"
        gap="14px"
        ml="auto"
        align="center"
        display={{ base: 'none', lg: 'flex' }}
        fontFamily="mono"
        fontSize="11px"
        fontWeight={800}
        textTransform="uppercase"
      >
        {[
          ['/platform', 'Platform'],
          ['/agent-modes', 'Modes'],
          ['/local-runtimes', 'Runtimes'],
          ['/security-matrix', 'Security'],
          ['/pillars', 'Pillars'],
          ['/faq', 'FAQ'],
        ].map(([to, label]) => (
          <RouterLink
            key={to}
            to={to}
            style={{ color: '#8b99a4', textDecoration: 'none' }}
          >
            <Text _hover={{ color: 'sovereign.accent' }}>{label}</Text>
          </RouterLink>
        ))}
      </Flex>

      <Flex gap="8px" ml={{ base: 'auto', lg: '10px' }} align="center">
        <Button
          as={RouterLink}
          to="/pillars"
          size="sm"
          h="34px"
          variant="ghost"
          border="1px solid"
          borderColor="sovereign.line2"
          rounded="8px"
          fontFamily="mono"
          fontWeight={800}
          fontSize="11px"
          textTransform="uppercase"
          color="sovereign.muted"
          display={{ base: 'inline-flex', lg: 'none' }}
          _hover={{ borderColor: 'sovereign.accent', color: 'sovereign.text' }}
        >
          Pillars
        </Button>
        <Button
          as="a"
          href="https://app.codingagent.in/"
          size="sm"
          h="34px"
          bg="sovereign.accent"
          color="white"
          rounded="8px"
          fontFamily="mono"
          fontWeight={800}
          fontSize="11px"
          textTransform="uppercase"
          _hover={{ bg: 'sovereign.accent2' }}
        >
          ▶ Launch Console
        </Button>
        <Button
          as={RouterLink}
          to="/login"
          size="sm"
          h="34px"
          variant="ghost"
          border="1px solid"
          borderColor="sovereign.line2"
          rounded="8px"
          fontFamily="mono"
          fontWeight={800}
          fontSize="11px"
          textTransform="uppercase"
          color="sovereign.text"
          _hover={{ borderColor: 'sovereign.accent' }}
        >
          Sign in
        </Button>
      </Flex>
    </Flex>

    <Box
      as="main"
      id="main"
      overflowY="auto"
      background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.06), transparent 36%), sovereign.bg"
    >
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Outlet />
      </Container>
    </Box>

    <PublicFooter />
  </Box>
);

const PublicFooter = () => (
  <Box
    as="footer"
    borderTop="1px solid"
    borderColor="sovereign.line"
    bg="#080b0f"
    px={{ base: 4, md: 6 }}
    py={6}
  >
    <Container maxW="container.xl">
      <VStack align="flex-start" spacing={3}>
        <Text
          fontFamily="mono"
          fontSize="9px"
          fontWeight={800}
          textTransform="uppercase"
          letterSpacing="0.18em"
          color="sovereign.dim"
        >
          Sovereign · Local-LLM-First · MCP-Native
        </Text>
        <Flex gap={4} flexWrap="wrap" fontFamily="mono" fontSize="11px" fontWeight={700}>
          <RouterLink to="/platform" style={{ color: '#8b99a4' }}>
            Platform
          </RouterLink>
          <RouterLink to="/agent-modes" style={{ color: '#8b99a4' }}>
            Agent Modes
          </RouterLink>
          <RouterLink to="/local-runtimes" style={{ color: '#8b99a4' }}>
            Local Runtimes
          </RouterLink>
          <RouterLink to="/security-matrix" style={{ color: '#8b99a4' }}>
            Security Matrix
          </RouterLink>
          <RouterLink to="/pillars" style={{ color: '#8b99a4' }}>
            Pillar Directory ({ALL_PILLARS.length})
          </RouterLink>
          <RouterLink to="/faq" style={{ color: '#8b99a4' }}>
            FAQ
          </RouterLink>
          <a href="https://app.codingagent.in/" style={{ color: '#8b99a4' }}>
            Launch Console
          </a>
          <a
            href="https://github.com/CodesbyFebin/Coding-Agent"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8b99a4' }}
          >
            Source [GitHub]
          </a>
          <RouterLink to="/login" style={{ color: '#8b99a4' }}>
            Sign in
          </RouterLink>
        </Flex>
        <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
          codingagent.in — authoritative backend required · verification-first agentic engineering
        </Text>
      </VStack>
    </Container>
  </Box>
);
