'use client';
import { useState } from 'react';
import { Box, Heading, Text, SimpleGrid, Flex, Button } from '@chakra-ui/react';
import {
  Layers,
  Network,
  ShieldCheck,
  HardDrive,
  FileCheck2,
  Cpu,
} from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SURFACES, TERMINAL_MISSIONS } from '../../../frontend/src/data/localRuntimesData';
import { EXECUTION_STAGES } from '../../../frontend/src/data/architectureData';
// Public platform overview: the six architectural theses, the eight delivery
// surfaces, and illustrative mission traces from the reference marketing
// build. Terminal traces are demo transcripts — clearly labeled as such —
// never presented as live execution (truth-boundary policy).
interface Thesis {
  num: string;
  title: string;
  desc: string;
  detail: string;
  icon: React.ReactNode;
}

const THESES: Thesis[] = [
  {
    num: '01 // RUNTIME',
    title: 'Portable agent core',
    desc: 'One architectural core designed to power IDE, CLI, desktop, web, mobile and CI surfaces without redefining execution semantics for every client.',
    detail:
      'Eliminates fragmented behavior across tools: whether triggered in GitHub Actions or VS Code, the agent uses the same state machine, tool permissions, and verification gates.',
    icon: <Layers size={18} strokeWidth={2.5} aria-hidden />,
  },
  {
    num: '02 // FABRIC',
    title: 'Model fabric routing',
    desc: 'Route by coding capability, privacy, context, latency and operator policy instead of binding engineering workflows to a single model vendor.',
    detail:
      'Dynamic router dispatches lightweight tasks to local Ollama/vLLM endpoints and escalates architectural reasoning to frontier models under strict compliance policies.',
    icon: <Network size={18} strokeWidth={2.5} aria-hidden />,
  },
  {
    num: '03 // BOUNDARY',
    title: 'Tool governance',
    desc: 'Filesystem, shell, Git, browser, database and MCP actions belong behind explicit permission, sandbox, approval and audit boundaries.',
    detail:
      'Tools operate in isolated Linux namespaces or ephemeral containers with default-deny network rules and path normalization to prevent directory traversal.',
    icon: <ShieldCheck size={18} strokeWidth={2.5} aria-hidden />,
  },
  {
    num: '04 // SOVEREIGNTY',
    title: 'Local-first execution',
    desc: 'Local models and local context are first-class design targets for private repositories, offline work and environments where external inference is not appropriate.',
    detail:
      'Enables high-assurance air-gapped engineering: proprietary code never leaves local developer hardware or private VPC clusters.',
    icon: <HardDrive size={18} strokeWidth={2.5} aria-hidden />,
  },
  {
    num: '05 // INTEGRITY',
    title: 'Evidence-led verification',
    desc: 'Builds, tests, security checks and artifact hashes should determine completion. A model saying "done" is not a verification result.',
    detail:
      'Decouples model verbal confidence from engineering reality: tasks are marked completed only when deterministic test runners and typecheckers return exit code 0.',
    icon: <FileCheck2 size={18} strokeWidth={2.5} aria-hidden />,
  },
  {
    num: '06 // CAPABILITY',
    title: 'Reusable versioned skills',
    desc: 'Turn successful, reviewed workflows into versioned skills with declared tools, inputs, policy requirements and verification criteria.',
    detail:
      'Codifies tribal engineering knowledge into versioned SKILL.md modules that can be shared, audited, and executed repeatedly across the entire organization.',
    icon: <Cpu size={18} strokeWidth={2.5} aria-hidden />,
  },
];

export const PlatformPage = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [missionId, setMissionId] = useState(TERMINAL_MISSIONS[0].id);
  const mission = TERMINAL_MISSIONS.find((m) => m.id === missionId)!;

  return (
    <Box maxW="1280px" mx="auto">
      <SectionHeader
        eyebrow="PLATFORM THESIS // ARCHITECTURAL FOUNDATION"
        title="Build agents like"
        highlight="production systems"
        description="CodingAgent.in treats an AI coding agent as a controlled engineering runtime: context, model policy, tools, workspaces, memory, permissions, evidence and independent verification are explicit components."
      />

      {/* Thesis grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={16}>
        {THESES.map((item, idx) => (
          <Box
            key={item.num}
            as="article"
            p={5}
            bg="sovereign.panel"
            border="1px solid"
            borderColor="sovereign.line"
            rounded="10px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            cursor="pointer"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            _hover={{ bg: '#141b22', borderColor: 'sovereign.flame' }}
          >
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text
                  fontFamily="mono"
                  fontSize="11px"
                  fontWeight={900}
                  letterSpacing="0.2em"
                  color="sovereign.flame"
                  textTransform="uppercase"
                >
                  {item.num}
                </Text>
                <Box
                  p={2}
                  border="1px solid"
                  borderColor="sovereign.line"
                  rounded="6px"
                  color="sovereign.accent"
                >
                  {item.icon}
                </Box>
              </Flex>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="lg"
                fontWeight={900}
                textTransform="uppercase"
                mb={2}
              >
                {item.title}
              </Heading>
              <Text
                fontSize="xs"
                fontFamily="mono"
                color="sovereign.muted"
                lineHeight="1.7"
                mb={3}
              >
                {item.desc}
              </Text>
            </Box>
            {expanded === idx ? (
              <Box pt={3} borderTop="1px solid" borderColor="sovereign.line2">
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  fontWeight={900}
                  textTransform="uppercase"
                  color="sovereign.flame"
                  mb={1.5}
                >
                  Specification //
                </Text>
                <Text fontSize="xs" color="sovereign.muted" lineHeight="1.7">
                  {item.detail}
                </Text>
              </Box>
            ) : (
              <Text
                fontFamily="mono"
                fontSize="10px"
                fontWeight={800}
                textTransform="uppercase"
                letterSpacing="0.1em"
                color="sovereign.dim"
              >
                Inspect spec ↓
              </Text>
            )}
          </Box>
        ))}
      </SimpleGrid>

      {/* Surfaces grid */}
      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight={900}
        textTransform="uppercase"
        letterSpacing="-0.02em"
        mb={2}
      >
        One core,{' '}
        <Box as="span" color="sovereign.flame">
          every surface
        </Box>
      </Heading>
      <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" mb={6} maxW="2xl">
        The same governed runtime is reachable from the editor, the terminal,
        CI, the browser, and mobile — each surface exposes the same policy and
        verification semantics.
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={16}>
        {SURFACES.map((s) => (
          <Box
            key={s.id}
            as="article"
            p={4}
            border="1px solid"
            borderColor="sovereign.line"
            bg="sovereign.panel"
            rounded="10px"
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontFamily="heading" fontWeight={900} fontSize="sm" textTransform="uppercase">
                {s.name}
              </Text>
              <Text
                fontFamily="mono"
                fontSize="9px"
                fontWeight={900}
                px={2}
                py={0.5}
                bg="sovereign.flameSoft"
                color="sovereign.flame"
                rounded="4px"
                textTransform="uppercase"
              >
                {s.type}
              </Text>
            </Flex>
            <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" lineHeight="1.6" mb={3}>
              {s.description}
            </Text>
            <Flex flexWrap="wrap" gap={1} mb={3}>
              {s.capabilities.map((c) => (
                <Text
                  key={c}
                  fontFamily="mono"
                  fontSize="9px"
                  fontWeight={700}
                  px={2}
                  py={0.5}
                  border="1px solid"
                  borderColor="sovereign.line2"
                  rounded="full"
                  color="sovereign.dim"
                  textTransform="uppercase"
                >
                  {c}
                </Text>
              ))}
            </Flex>
            <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
              {s.integrationMethod}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Illustrative mission traces — explicitly labeled demo data */}
      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight={900}
        textTransform="uppercase"
        letterSpacing="-0.02em"
        mb={2}
      >
        Mission traces
      </Heading>
      <Text fontFamily="mono" fontSize="xs" color="sovereign.warn" mb={4} maxW="2xl">
        ILLUSTRATIVE DEMO TRANSCRIPTS — not live execution. Real missions,
        approvals and evidence come only from a configured backend.
      </Text>
      <Flex flexWrap="wrap" gap={2} mb={4}>
        {TERMINAL_MISSIONS.map((m) => (
          <Button
            key={m.id}
            size="xs"
            onClick={() => setMissionId(m.id)}
            px={3}
            py={1.5}
            h="auto"
            rounded="6px"
            border="1px solid"
            borderColor={missionId === m.id ? 'sovereign.flame' : 'sovereign.line'}
            bg={missionId === m.id ? 'sovereign.flame' : 'transparent'}
            color={missionId === m.id ? 'black' : 'sovereign.muted'}
            fontFamily="mono"
            fontWeight={900}
            textTransform="uppercase"
            _hover={{ color: missionId === m.id ? 'black' : 'sovereign.text' }}
          >
            {m.name}
          </Button>
        ))}
      </Flex>
      <Box
        bg="#06080a"
        border="1px solid"
        borderColor="sovereign.line"
        rounded="12px"
        overflow="hidden"
      >
        <Flex
          px={4}
          py={2.5}
          borderBottom="1px solid"
          borderColor="sovereign.line"
          fontFamily="mono"
          fontSize="10px"
          fontWeight={800}
          color="sovereign.muted"
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          terminal · illustrative trace
        </Flex>
        <Box p={4} fontFamily="mono" fontSize={{ base: '10px', md: '11px' }} lineHeight="2">
          {mission.logs.map((log, i) => (
            <Flex key={i} gap={2} flexWrap="wrap">
              <Text
                as="span"
                color={
                  log.type === 'prompt'
                    ? 'sovereign.accent2'
                    : log.type === 'verify'
                      ? 'sovereign.good'
                      : log.type === 'result'
                        ? 'sovereign.good'
                        : 'sovereign.blue'
                }
                fontWeight={800}
                flexShrink={0}
                minW="64px"
              >
                [{log.label}]
              </Text>
              <Text as="span" color="sovereign.muted" wordBreak="break-word">
                {log.text}
                {log.status && (
                  <Text
                    as="span"
                    ml={2}
                    fontWeight={900}
                    color={
                      log.status === 'ALLOW'
                        ? 'sovereign.good'
                        : log.status === 'ASK'
                          ? 'sovereign.warn'
                          : 'sovereign.bad'
                    }
                  >
                    {log.status}
                  </Text>
                )}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>

      {/* Six-stage execution loop */}
      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight={900}
        textTransform="uppercase"
        letterSpacing="-0.02em"
        mt={16}
        mb={2}
      >
        The execution{' '}
        <Box as="span" color="sovereign.flame">
          control loop
        </Box>
      </Heading>
      <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" mb={6} maxW="2xl">
        Every mission passes six governed stages — with explicit governance
        actions, produced artifacts, and a safety check at each boundary.
      </Text>
      <Flex flexDirection="column" gap={3}>
        {EXECUTION_STAGES.map((stage) => (
          <Box
            key={stage.step}
            as="article"
            p={4}
            border="1px solid"
            borderColor="sovereign.line"
            bg="sovereign.panel"
            rounded="10px"
          >
            <Flex align="baseline" gap={3} mb={2} flexWrap="wrap">
              <Text
                fontFamily="mono"
                fontWeight={900}
                fontSize="2xl"
                color="sovereign.flame"
                lineHeight={1}
              >
                {String(stage.step).padStart(2, '0')}
              </Text>
              <Heading
                as="h3"
                fontFamily="heading"
                fontSize="md"
                fontWeight={900}
                textTransform="uppercase"
              >
                {stage.name}
              </Heading>
              <Text fontFamily="mono" fontSize="11px" color="sovereign.blue">
                {stage.headline}
              </Text>
            </Flex>
            <Text fontSize="xs" color="sovereign.muted" lineHeight="1.7" mb={3}>
              {stage.description}
            </Text>
            {[
              ['Governance', stage.governanceAction, 'sovereign.warn'],
              ['Safety check', stage.safetyCheck, 'sovereign.bad'],
            ].map(([label, body, color]) => (
              <Text key={label} fontSize="11px" fontFamily="mono" lineHeight="1.7" mb={1}>
                <Text as="span" fontWeight={900} textTransform="uppercase" color={color}>
                  {label}:{' '}
                </Text>
                <Text as="span" color="sovereign.muted">
                  {body}
                </Text>
              </Text>
            ))}
            <Flex flexWrap="wrap" gap={1} mt={2}>
              {stage.artifactsProduced.map((a) => (
                <Text
                  key={a}
                  fontFamily="mono"
                  fontSize="9px"
                  fontWeight={700}
                  px={2}
                  py={0.5}
                  border="1px solid"
                  borderColor="sovereign.line2"
                  rounded="full"
                  color="sovereign.dim"
                  textTransform="uppercase"
                >
                  {a}
                </Text>
              ))}
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
