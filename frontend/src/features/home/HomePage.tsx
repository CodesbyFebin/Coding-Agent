import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Container,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useAuthStore } from '../../stores/authStore';
import { DashboardPage } from '../dashboard/DashboardPage';
import { MainLayout } from '../../components/layout/MainLayout';

// "/" serves two masters: authenticated users get the Command Center inside
// the 3-pane shell; anonymous visitors get the public, indexable landing
// page (hero + knowledge links + app CTA) so the production homepage ships
// real content in the initial HTML.
export const HomePage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);

  // During prerender (and only there) the store's loading flag is still the
  // initial true; the client App never mounts routes in that state, so
  // treating loading as anonymous yields the indexable landing HTML without
  // changing runtime behavior.
  if (loading || !isAuthenticated) {return <Landing />;}
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
};

const CTAS = [
  { href: '/pillars', label: 'Explore the Pillars', primary: true, internal: true },
  { href: 'https://app.codingagent.in/', label: '▶ Launch Console', primary: false, internal: false },
  {
    href: 'https://github.com/CodesbyFebin/Coding-Agent',
    label: 'Source [GitHub]',
    primary: false,
    internal: false,
  },
];

const STATS = [
  {
    num: '01 // INFERENCE',
    title: 'LOCAL-FIRST',
    body: 'Ollama, vLLM and llama.cpp as first-class targets for private repos.',
    accent: true,
  },
  {
    num: '02 // PROTOCOL',
    title: 'MCP-NATIVE',
    body: 'Governed tool discovery and schema contracts.',
    accent: false,
  },
  {
    num: '03 // EVIDENCE',
    title: 'TEST-LED',
    body: 'Compiler exit codes determine completion.',
    accent: false,
  },
  {
    num: '04 // POLICY',
    title: 'STRICT GATE',
    body: 'Explicit human approval on write and network actions.',
    accent: false,
  },
];

const Landing = () => (
  <Box
    minH="100dvh"
    bg="sovereign.bg"
    color="sovereign.text"
    background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.08), transparent 36%), sovereign.bg"
  >
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
      <HStack gap="9px">
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
      </HStack>
      <HStack gap="8px" ml="auto">
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
      </HStack>
    </Flex>

    <Container maxW="1280px" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
      <Text
        fontFamily="mono"
        fontSize={{ base: '10px', md: '12px' }}
        fontWeight={900}
        letterSpacing="0.35em"
        color="sovereign.accent"
        textTransform="uppercase"
        mb={4}
      >
        ■ SOVEREIGN · LOCAL-LLM-FIRST · MCP-NATIVE
      </Text>

      <Heading
        as="h1"
        fontFamily="heading"
        fontSize={{ base: '4xl', md: '7xl' }}
        fontWeight={900}
        lineHeight={0.95}
        letterSpacing="-0.03em"
        textTransform="uppercase"
        maxW="5xl"
        mb={5}
      >
        Engineering with AI coding agents,{' '}
        <Box
          as="span"
          bg="sovereign.flame"
          color="black"
          px={{ base: 2, md: 3 }}
          display="inline-block"
          mt={2}
        >
          under your control.
        </Box>
      </Heading>

      <Text
        fontSize={{ base: 'md', md: 'xl' }}
        fontFamily="heading"
        fontWeight={700}
        color="sovereign.muted"
        maxW="3xl"
        mb={3}
      >
        Sovereign, open-source, local-LLM-first agentic engineering for
        planning, coding, debugging, review, security and verification.
      </Text>
      <Text
        fontFamily="mono"
        fontSize={{ base: '11px', md: 'xs' }}
        color="sovereign.muted"
        maxW="2xl"
        lineHeight="1.7"
        mb={8}
      >
        Models reason, tools act through explicit boundaries, evidence records
        what happened, and verification determines whether work is actually
        done.
      </Text>

      <Flex flexWrap="wrap" gap={0} mb={12}>
        {CTAS.map((c, i) => (
          <Button
            key={c.label}
            as={c.internal ? RouterLink : 'a'}
            {...(c.internal
              ? { to: c.href }
              : { href: c.href, target: '_blank', rel: 'noopener noreferrer' })}
            h={{ base: '52px', md: '56px' }}
            px={{ base: 6, md: 10 }}
            rounded={0}
            border="1px solid"
            borderLeftWidth={i === 0 ? '1px' : '0px'}
            borderColor="sovereign.line2"
            bg={c.primary ? 'sovereign.flame' : 'sovereign.panel'}
            color={c.primary ? 'black' : 'sovereign.text'}
            fontFamily="heading"
            fontWeight={900}
            textTransform="uppercase"
            letterSpacing="0.2em"
            fontSize="11px"
            _hover={{
              bg: c.primary ? 'sovereign.accent' : '#141b22',
            }}
          >
            {c.label}
          </Button>
        ))}
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={0} border="1px solid" borderColor="sovereign.line" mb={14}>
        {STATS.map((s) => (
          <Box
            key={s.num}
            p={{ base: 5, md: 7 }}
            bg={s.accent ? 'sovereign.flame' : 'sovereign.panel'}
            color={s.accent ? 'black' : 'sovereign.text'}
            borderColor="sovereign.line"
            borderWidth="0px"
            borderRightWidth="1px"
            borderBottomWidth={{ base: '1px', lg: '0px' }}
          >
            <Text
              fontFamily="mono"
              fontSize="10px"
              fontWeight={900}
              letterSpacing="0.3em"
              textTransform="uppercase"
              color={s.accent ? 'rgba(0,0,0,0.7)' : 'sovereign.flame'}
              mb={2}
            >
              {s.num}
            </Text>
            <Text
              fontFamily="heading"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight={900}
              textTransform="uppercase"
              mb={2}
            >
              {s.title}
            </Text>
            <Text
              fontFamily="mono"
              fontSize="11px"
              color={s.accent ? 'rgba(0,0,0,0.8)' : 'sovereign.muted'}
            >
              {s.body}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <VStack align="flex-start" spacing={3}>
        <Text
          fontFamily="mono"
          fontSize="10px"
          fontWeight={900}
          letterSpacing="0.3em"
          textTransform="uppercase"
          color="sovereign.flame"
        >
          ■ THE KNOWLEDGE GRAPH
        </Text>
        <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7">
          80 architectural pillars of agentic engineering — agents, MCP,
          local runtimes, security, verification, enterprise tooling and
          India-first solutions — each with explicit rationale and a
          verification aspect.
        </Text>
        <Flex gap={2} flexWrap="wrap">
          {[
            ['/platform', 'Platform'],
            ['/agent-modes', 'Agent Modes'],
            ['/local-runtimes', 'Local Runtimes'],
            ['/security-matrix', 'Security Matrix'],
            ['/faq', 'FAQ'],
          ].map(([to, label]) => (
            <Button
              key={to}
              as={RouterLink}
              to={to}
              size="xs"
              px={3}
              py={1.5}
              h="auto"
              rounded="6px"
              border="1px solid"
              borderColor="sovereign.line2"
              bg="transparent"
              color="sovereign.muted"
              fontFamily="mono"
              fontWeight={800}
              textTransform="uppercase"
              _hover={{ color: 'sovereign.text', borderColor: 'sovereign.accent' }}
            >
              {label}
            </Button>
          ))}
        </Flex>
      </VStack>
    </Container>

    <Box borderTop="1px solid" borderColor="sovereign.line" bg="#080b0f" px={{ base: 4, md: 6 }} py={5}>
      <Container maxW="1280px">
        <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
          codingagent.in — sovereign · local-LLM-first · MCP-native · app.codingagent.in is the authenticated console
        </Text>
      </Container>
    </Box>
  </Box>
);
