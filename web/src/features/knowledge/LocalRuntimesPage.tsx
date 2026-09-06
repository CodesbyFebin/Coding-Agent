'use client';
import { Box, Heading, Text, SimpleGrid, Flex } from '@chakra-ui/react';
import { LOCAL_RUNTIMES, ROUTING_DIMENSIONS } from '../../../frontend/src/data/localRuntimesData';
import { SectionHeader } from '../../components/ui/SectionHeader';
// Public page for local-LLM runtimes (Ollama, vLLM, llama.cpp, LM Studio)
// and the four routing dimensions that decide where a mission's inference
// runs — the sovereign local-first story from the reference build.
export const LocalRuntimesPage = () => {

  return (
    <Box maxW="1280px" mx="auto">
      <SectionHeader
        eyebrow="LOCAL LLMs // SOVEREIGN INFERENCE"
        title="Your code never has to"
        highlight="leave the machine"
        description="Local runtimes are first-class targets: private repositories route strictly to local models, with hardware-aware dispatch across VRAM, context size and task history."
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={16}>
        {LOCAL_RUNTIMES.map((rt) => (
          <Box
            key={rt.id}
            as="article"
            p={5}
            bg="sovereign.panel"
            border="1px solid"
            borderColor="sovereign.line"
            rounded="10px"
          >
            <Flex align="center" gap={2.5} mb={3}>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="lg"
                fontWeight={900}
                textTransform="uppercase"
              >
                {rt.name}
              </Heading>
              <Text
                fontFamily="mono"
                fontSize="9px"
                fontWeight={900}
                px={2}
                py={0.5}
                bg="sovereign.flameSoft"
                color="sovereign.flame"
                rounded="4px"
              >
                {rt.badge}
              </Text>
            </Flex>
            <Text fontFamily="mono" fontSize="10px" fontWeight={800} textTransform="uppercase" color="sovereign.blue" mb={2}>
              {rt.title}
            </Text>
            <Text fontSize="xs" fontFamily="mono" color="sovereign.muted" lineHeight="1.7" mb={4}>
              {rt.description}
            </Text>
            {[
              ['Specs', rt.specSummary],
              ['Hardware', rt.recommendedHardware],
              ['Privacy', rt.privacyPosture],
            ].map(([k, v]) => (
              <Flex
                key={k}
                gap={3}
                py="6px"
                borderBottom="1px solid"
                borderColor="sovereign.line"
                _last={{ border: 'none' }}
                fontSize="11px"
                fontFamily="mono"
              >
                <Text color="sovereign.dim" flexShrink={0} w="70px">
                  {k}
                </Text>
                <Text color="sovereign.muted">{v}</Text>
              </Flex>
            ))}
          </Box>
        ))}
      </SimpleGrid>

      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight={900}
        textTransform="uppercase"
        letterSpacing="-0.02em"
        mb={2}
      >
        Routing{' '}
        <Box as="span" color="sovereign.flame">
          dimensions
        </Box>
      </Heading>
      <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" mb={6} maxW="2xl">
        Four rules decide where inference runs: the repository's privacy
        classification, real GPU memory headroom, the required context window,
        and each model's empirical verification history.
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
        {ROUTING_DIMENSIONS.map((dim) => (
          <Box
            key={dim.id}
            as="article"
            p={4}
            border="1px solid"
            borderColor="sovereign.line"
            bg="sovereign.panel"
            rounded="10px"
          >
            <Flex align="center" gap={2} mb={2}>
              <Text fontFamily="heading" fontWeight={900} fontSize="sm" textTransform="uppercase">
                {dim.name}
              </Text>
              <Text
                fontFamily="mono"
                fontSize="9px"
                fontWeight={900}
                px={2}
                py={0.5}
                border="1px solid"
                borderColor="sovereign.line2"
                rounded="4px"
                color="sovereign.dim"
              >
                {dim.badge}
              </Text>
            </Flex>
            <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" lineHeight="1.7">
              {dim.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
