'use client';

import Link from 'next/link';
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

// Public landing page for anonymous visitors; authenticated users use the
// Command Center on the app origin.
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
  { num: '01 // INFERENCE', title: 'LOCAL-FIRST', body: 'Ollama, vLLM and llama.cpp as first-class targets for private repos.', accent: true },
  { num: '02 // PROTOCOL', title: 'MCP-NATIVE', body: 'Governed tool discovery and schema contracts.', accent: false },
  { num: '03 // EVIDENCE', title: 'TEST-LED', body: 'Compiler exit codes determine completion.', accent: false },
  { num: '04 // POLICY', title: 'STRICT GATE', body: 'Explicit human approval on write and network actions.', accent: false },
];

export default function Landing() {
  return (
    <Box
      minH="70dvh"
      background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.08), transparent 36%), sovereign.bg"
    >
      <Container maxW="1280px" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
        <Text fontFamily="mono" fontSize={{ base: '10px', md: '12px' }} fontWeight={900} letterSpacing="0.35em" color="sovereign.accent" textTransform="uppercase" mb={4}>
          ■ SOVEREIGN · LOCAL-LLM-FIRST · MCP-NATIVE
        </Text>
        <Heading as="h1" fontFamily="heading" fontSize={{ base: '4xl', md: '7xl' }} fontWeight={900} lineHeight={0.95} letterSpacing="-0.03em" textTransform="uppercase" maxW="5xl" mb={5}>
          Engineering with AI coding agents,{' '}
          <Box as="span" bg="sovereign.flame" color="black" px={{ base: 2, md: 3 }} display="inline-block" mt={2}>
            under your control.
          </Box>
        </Heading>
        <Text fontSize={{ base: 'md', md: 'xl' }} fontFamily="heading" fontWeight={700} color="sovereign.muted" maxW="3xl" mb={3}>
          Sovereign, open-source, local-LLM-first agentic engineering for planning, coding, debugging, review, security and verification.
        </Text>
        <Text fontFamily="mono" fontSize={{ base: '11px', md: 'xs' }} color="sovereign.muted" maxW="2xl" lineHeight="1.7" mb={8}>
          Models reason, tools act through explicit boundaries, evidence records what happened, and verification determines whether work is actually done.
        </Text>
        <Flex flexWrap="wrap" gap={0} mb={12}>
          {CTAS.map((c, i) => (
            <Button
              key={c.label}
              as={c.internal ? Link : 'a'}
              {...(c.internal ? { href: c.href } : { href: c.href, target: '_blank', rel: 'noopener noreferrer' })}
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
              _hover={{ bg: c.primary ? 'sovereign.accent' : '#141b22' }}
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
              <Text fontFamily="mono" fontSize="10px" fontWeight={900} letterSpacing="0.3em" textTransform="uppercase" color={s.accent ? 'rgba(0,0,0,0.7)' : 'sovereign.flame'} mb={2}>
                {s.num}
              </Text>
              <Text fontFamily="heading" fontSize={{ base: 'xl', md: '2xl' }} fontWeight={900} textTransform="uppercase" mb={2}>
                {s.title}
              </Text>
              <Text fontFamily="mono" fontSize="11px" color={s.accent ? 'rgba(0,0,0,0.8)' : 'sovereign.muted'}>
                {s.body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <VStack align="flex-start" spacing={3}>
          <Text fontFamily="mono" fontSize="10px" fontWeight={900} letterSpacing="0.3em" textTransform="uppercase" color="sovereign.flame">
            ■ THE KNOWLEDGE GRAPH
          </Text>
          <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7">
            80 architectural pillars of agentic engineering — agents, MCP, local runtimes, security, verification, enterprise tooling and India-first solutions — each with explicit rationale and a verification aspect.
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {[
              ['/platform', 'Platform'],
              ['/agent-modes', 'Agent Modes'],
              ['/local-runtimes', 'Local Runtimes'],
              ['/security-matrix', 'Security Matrix'],
              ['/faq', 'FAQ'],
            ].map(([href, label]) => (
              <Button
                key={href}
                as={Link}
                href={href}
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
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
