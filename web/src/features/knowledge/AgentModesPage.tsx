'use client';
import { Box, Heading, Text, SimpleGrid, Flex } from '@chakra-ui/react';
import { CheckCircle2, Ban, HelpCircle } from 'lucide-react';
import { AGENT_MODES } from '../../../frontend/src/data/agentModesData';
import { SectionHeader } from '../../components/ui/SectionHeader';
// Public page for the six governed agent modes (Plan / Code / Debug /
// Review / Security / Ask) with their allowed and restricted tool scopes and
// per-mode verification requirements — merged from the reference build.
export const AgentModesPage = () => {

  return (
    <Box maxW="1280px" mx="auto">
      <SectionHeader
        eyebrow="AGENT MODES // SCOPED AUTHORITY"
        title="Six modes, six"
        highlight="permission scopes"
        description="Every mission runs in exactly one mode. Each mode declares the tools it may use, the tools it may never use, and the independent verification its output must pass before completion."
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {AGENT_MODES.map((mode) => (
          <Box
            key={mode.id}
            as="article"
            p={5}
            bg="sovereign.panel"
            border="1px solid"
            borderColor="sovereign.line"
            borderTopWidth="3px"
            borderTopColor={mode.accentColor}
            rounded="10px"
          >
            <Flex align="center" gap={3} mb={3}>
              <Box
                w="34px"
                h="34px"
                rounded="8px"
                display="grid"
                placeItems="center"
                fontFamily="mono"
                fontWeight={900}
                fontSize="15px"
                color="black"
                bg={mode.accentColor}
                flexShrink={0}
                aria-hidden
              >
                {mode.code}
              </Box>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="lg"
                fontWeight={900}
                textTransform="uppercase"
              >
                {mode.label}
              </Heading>
            </Flex>

            <Text fontSize="sm" color="sovereign.muted" lineHeight="1.7" mb={4}>
              {mode.summary}
            </Text>

            <Text
              fontFamily="mono"
              fontSize="10px"
              fontWeight={900}
              textTransform="uppercase"
              letterSpacing="0.15em"
              color="sovereign.blue"
              mb={1.5}
            >
              Primary mission
            </Text>
            <Text fontSize="xs" fontFamily="mono" color="sovereign.text" lineHeight="1.7" mb={4}>
              {mode.primaryMission}
            </Text>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={4}>
              <Box>
                <Flex align="center" gap={1.5} mb={2}>
                  <CheckCircle2 size={13} color="#33d17a" aria-hidden />
                  <Text
                    fontFamily="mono"
                    fontSize="10px"
                    fontWeight={900}
                    textTransform="uppercase"
                    color="sovereign.good"
                  >
                    Allowed tools
                  </Text>
                </Flex>
                {mode.allowedTools.map((t) => (
                  <Text
                    key={t}
                    fontFamily="mono"
                    fontSize="10px"
                    color="sovereign.muted"
                    py="3px"
                    borderBottom="1px solid"
                    borderColor="sovereign.line"
                  >
                    {t}
                  </Text>
                ))}
              </Box>
              <Box>
                <Flex align="center" gap={1.5} mb={2}>
                  <Ban size={13} color="#ff6b6b" aria-hidden />
                  <Text
                    fontFamily="mono"
                    fontSize="10px"
                    fontWeight={900}
                    textTransform="uppercase"
                    color="sovereign.bad"
                  >
                    Restricted tools
                  </Text>
                </Flex>
                {mode.restrictedTools.map((t) => (
                  <Text
                    key={t}
                    fontFamily="mono"
                    fontSize="10px"
                    color="sovereign.muted"
                    py="3px"
                    borderBottom="1px solid"
                    borderColor="sovereign.line"
                  >
                    {t}
                  </Text>
                ))}
              </Box>
            </SimpleGrid>

            <Box
              p={3}
              border="1px solid"
              borderColor="sovereign.line2"
              borderLeftWidth="3px"
              borderLeftColor="sovereign.good"
              rounded="8px"
              bg="rgba(51,209,122,0.04)"
              mb={3}
            >
              <Flex align="center" gap={1.5} mb={1}>
                <CheckCircle2 size={12} color="#33d17a" aria-hidden />
                <Text
                  fontFamily="mono"
                  fontSize="9px"
                  fontWeight={900}
                  textTransform="uppercase"
                  letterSpacing="0.15em"
                  color="sovereign.good"
                >
                  Verification requirement
                </Text>
              </Flex>
              <Text fontSize="xs" color="sovereign.muted" lineHeight="1.7">
                {mode.verificationRequirement}
              </Text>
            </Box>

            <Flex align="center" gap={1.5}>
              <HelpCircle size={12} color="#596771" aria-hidden />
              <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
                {mode.sampleWorkflow}
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
