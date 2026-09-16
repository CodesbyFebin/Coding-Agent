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
import { AGENT_MODES } from '../../../frontend/src/data/agentModesData';
import { LOCAL_RUNTIMES } from '../../../frontend/src/data/localRuntimesData';
import { PILLAR_CATEGORIES, ALL_PILLARS } from '../../../frontend/src/data/pillarsData';
import { SECURITY_RULES } from '../../../frontend/src/data/architectureData';

// Public landing page for anonymous visitors; authenticated users use the
// Command Center on the app origin. Every stat and card below is sourced
// from the same data the platform pages themselves render from, so the
// homepage can never drift out of sync with what's actually shipped.
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
  { num: '01 // INFERENCE', title: 'LOCAL-FIRST', body: 'Ollama, vLLM, llama.cpp and LM Studio as first-class targets for private repos.', accent: true },
  { num: '02 // PROTOCOL', title: 'MCP-NATIVE', body: 'Governed tool discovery and schema contracts.', accent: false },
  { num: '03 // EVIDENCE', title: 'TEST-LED', body: 'Compiler exit codes determine completion.', accent: false },
  { num: '04 // POLICY', title: 'STRICT GATE', body: 'Explicit human approval on write and network actions.', accent: false },
];

const LOOP_STEPS = [
  { icon: '🧠', label: 'Model reasons', body: 'A local LLM plans the task and proposes a course of action.' },
  { icon: '🔧', label: 'Tools act', body: 'Execution happens through MCP-governed, schema-validated tool calls.' },
  { icon: '📋', label: 'Evidence records', body: 'Every action is logged — what ran, what changed, what it returned.' },
  { icon: '✅', label: 'Verification decides', body: 'Compiler exit codes and test results — not the model — determine completion.' },
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
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={0} border="1px solid" borderColor="sovereign.line" mb={20}>
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

        {/* Execution loop */}
        <SectionLabel>■ How it works</SectionLabel>
        <Heading as="h2" fontFamily="heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} textTransform="uppercase" letterSpacing="-0.02em" mb={3}>
          The agent <Box as="span" color="sovereign.flame">execution loop</Box>
        </Heading>
        <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7" mb={8}>
          Every task runs the same deterministic loop. The model never gets to declare its own work finished — verification does.
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={20}>
          {LOOP_STEPS.map((step, i) => (
            <Box key={step.label} p={5} bg="sovereign.panel" border="1px solid" borderColor="sovereign.line" rounded="10px" position="relative">
              <Text fontSize="1.5rem" mb={2} aria-hidden>{step.icon}</Text>
              <Text fontFamily="heading" fontWeight={900} fontSize="sm" textTransform="uppercase" mb={2}>
                {i + 1}. {step.label}
              </Text>
              <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" lineHeight="1.7">
                {step.body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Agent modes */}
        <SectionLabel>■ Agent modes</SectionLabel>
        <Heading as="h2" fontFamily="heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} textTransform="uppercase" letterSpacing="-0.02em" mb={3}>
          Six governed <Box as="span" color="sovereign.flame">modes</Box>
        </Heading>
        <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7" mb={8}>
          Each mode carries its own tool allowlist, restricted actions and verification requirement — not just a different prompt.
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3} mb={20}>
          {AGENT_MODES.map((mode) => (
            <Box key={mode.id} as="article" p={5} bg="sovereign.panel" border="1px solid" borderColor="sovereign.line" rounded="10px">
              <Flex align="center" gap={2} mb={3}>
                <Flex
                  w="28px"
                  h="28px"
                  rounded="6px"
                  align="center"
                  justify="center"
                  bg="sovereign.flameSoft"
                  color="sovereign.flame"
                  fontFamily="mono"
                  fontWeight={900}
                  fontSize="xs"
                  flexShrink={0}
                >
                  {mode.code}
                </Flex>
                <Heading as="h3" fontFamily="heading" fontSize="md" fontWeight={900} textTransform="uppercase">
                  {mode.label}
                </Heading>
              </Flex>
              <Text fontSize="xs" fontFamily="mono" color="sovereign.muted" lineHeight="1.7" mb={3}>
                {mode.summary}
              </Text>
              <Text fontSize="10px" fontFamily="mono" color="sovereign.dim" lineHeight="1.6">
                <Box as="span" color="sovereign.blue" fontWeight={700}>VERIFIES: </Box>
                {mode.verificationRequirement}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <HStack justify="flex-end" mb={20} mt={-14}>
          <Button as={Link} href="/agent-modes" size="sm" fontFamily="mono" fontWeight={900} textTransform="uppercase" fontSize="10px" color="sovereign.flame" variant="ghost">
            All agent modes →
          </Button>
        </HStack>

        {/* Local runtimes */}
        <SectionLabel>■ Local runtimes</SectionLabel>
        <Heading as="h2" fontFamily="heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} textTransform="uppercase" letterSpacing="-0.02em" mb={3}>
          {LOCAL_RUNTIMES.length} first-class <Box as="span" color="sovereign.flame">inference targets</Box>
        </Heading>
        <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7" mb={8}>
          Private repositories route strictly to local models, with hardware-aware dispatch across VRAM, context size and verification history.
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={20}>
          {LOCAL_RUNTIMES.map((rt) => (
            <Box key={rt.id} as="article" p={5} bg="sovereign.panel" border="1px solid" borderColor="sovereign.line" rounded="10px">
              <Text fontFamily="mono" fontSize="9px" fontWeight={900} px={2} py={0.5} bg="sovereign.flameSoft" color="sovereign.flame" rounded="4px" display="inline-block" mb={3}>
                {rt.badge}
              </Text>
              <Heading as="h3" fontFamily="heading" fontSize="lg" fontWeight={900} textTransform="uppercase" mb={2}>
                {rt.name}
              </Heading>
              <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" lineHeight="1.7">
                {rt.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <HStack justify="flex-end" mb={20} mt={-14}>
          <Button as={Link} href="/local-runtimes" size="sm" fontFamily="mono" fontWeight={900} textTransform="uppercase" fontSize="10px" color="sovereign.flame" variant="ghost">
            Routing dimensions →
          </Button>
        </HStack>

        {/* Security highlights */}
        <SectionLabel>■ Security posture</SectionLabel>
        <Heading as="h2" fontFamily="heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} textTransform="uppercase" letterSpacing="-0.02em" mb={3}>
          <Box as="span" color="sovereign.flame">ALLOW / ASK / DENY</Box> at every boundary
        </Heading>
        <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7" mb={8}>
          {SECURITY_RULES.length} capability rules across filesystem, network, git, deploy, database, shell and secrets — each with an explicit posture and mitigation, not a blanket policy.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={20}>
          {SECURITY_RULES.slice(0, 4).map((rule) => (
            <Box key={rule.capability} p={5} bg="sovereign.panel" border="1px solid" borderColor="sovereign.line" rounded="10px" display="flex" gap={4}>
              <PostureBadge posture={rule.posture} />
              <Box>
                <Heading as="h3" fontFamily="heading" fontSize="sm" fontWeight={900} textTransform="uppercase" mb={1}>
                  {rule.capability}
                </Heading>
                <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" lineHeight="1.7">
                  {rule.mitigation}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        <HStack justify="flex-end" mb={20} mt={-14}>
          <Button as={Link} href="/security-matrix" size="sm" fontFamily="mono" fontWeight={900} textTransform="uppercase" fontSize="10px" color="sovereign.flame" variant="ghost">
            Full security matrix →
          </Button>
        </HStack>

        {/* Knowledge graph */}
        <VStack align="flex-start" spacing={3} mb={16}>
          <SectionLabel noMargin>■ The knowledge graph</SectionLabel>
          <Heading as="h2" fontFamily="heading" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={900} textTransform="uppercase" letterSpacing="-0.02em">
            {ALL_PILLARS.length} architectural <Box as="span" color="sovereign.flame">pillars</Box>
          </Heading>
          <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.7">
            Agents, MCP, local runtimes, security, verification, enterprise tooling and India-first solutions — each pillar with explicit rationale and a verification aspect.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={2} w="full" pt={2}>
            {PILLAR_CATEGORIES.map((cat) => (
              <Box key={cat.id} p={3} border="1px solid" borderColor="sovereign.line2" rounded="8px" bg="sovereign.panel">
                <Text fontFamily="mono" fontSize="10px" fontWeight={800} color="sovereign.text" mb={1}>
                  {cat.label}
                </Text>
                <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
                  {cat.items.length} pillars
                </Text>
              </Box>
            ))}
          </SimpleGrid>
          <HStack gap={2} flexWrap="wrap" pt={2}>
            {[
              ['/platform', 'Platform'],
              ['/agent-modes', 'Agent Modes'],
              ['/local-runtimes', 'Local Runtimes'],
              ['/security-matrix', 'Security Matrix'],
              ['/faq', 'FAQ'],
              ['/pillars', 'All Pillars →'],
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

        {/* CTA */}
        <Box border="1px solid" borderColor="sovereign.line" bg="sovereign.panel" rounded="14px" p={{ base: 8, md: 12 }} textAlign="center">
          <Heading as="h2" fontFamily="heading" fontSize={{ base: 'xl', md: '3xl' }} fontWeight={900} textTransform="uppercase" mb={3}>
            Launch your <Box as="span" color="sovereign.flame">sovereign</Box> coding agent
          </Heading>
          <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="xl" mx="auto" mb={6}>
            Local inference, governed tools, verified outcomes. Open source, MIT-licensed.
          </Text>
          <Flex justify="center" gap={3} flexWrap="wrap">
            <Button
              as="a"
              href="https://app.codingagent.in/"
              target="_blank"
              rel="noopener noreferrer"
              h="48px"
              px={8}
              rounded="8px"
              bg="sovereign.flame"
              color="black"
              fontFamily="heading"
              fontWeight={900}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontSize="11px"
              _hover={{ bg: 'sovereign.accent' }}
            >
              ▶ Launch Console
            </Button>
            <Button
              as="a"
              href="https://github.com/CodesbyFebin/Coding-Agent"
              target="_blank"
              rel="noopener noreferrer"
              h="48px"
              px={8}
              rounded="8px"
              variant="outline"
              borderColor="sovereign.line2"
              fontFamily="heading"
              fontWeight={900}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontSize="11px"
              _hover={{ borderColor: 'sovereign.accent' }}
            >
              Source on GitHub
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

function SectionLabel({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <Text fontFamily="mono" fontSize="10px" fontWeight={900} letterSpacing="0.3em" textTransform="uppercase" color="sovereign.flame" mb={noMargin ? 0 : 3}>
      {children}
    </Text>
  );
}

function PostureBadge({ posture }: { posture: string }) {
  const color = posture === 'ALLOW' ? 'sovereign.good' : posture === 'ASK' ? 'sovereign.warn' : 'sovereign.bad';
  return (
    <Flex
      w="52px"
      h="28px"
      rounded="6px"
      align="center"
      justify="center"
      border="1px solid"
      borderColor={color}
      color={color}
      fontFamily="mono"
      fontWeight={900}
      fontSize="9px"
      flexShrink={0}
    >
      {posture}
    </Flex>
  );
}
