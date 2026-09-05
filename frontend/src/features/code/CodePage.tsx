import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { useRuntimeTruth } from '../../stores/runtimeTruth';
import { TruthPill } from '../../components/ui/TruthPill';

export const CodePage = () => {
  const truth = useRuntimeTruth();
  return (
    <Box maxW="680px" mx="auto" pt={{ base: 4, md: 7 }}>
      <Flex align="flex-start" justify="space-between" gap={5} mb={5}>
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Code Editor
          </Heading>
          <Text fontSize="md" color="sovereign.muted" mt={1}>
            Awaiting backend configuration
          </Text>
        </Box>
        <TruthPill kind={truth.kind} label={truth.label} />
      </Flex>
      <Box
        p={8}
        rounded="12px"
        border="1px dashed"
        borderColor="sovereign.line2"
        color="sovereign.purple"
        fontFamily="mono"
        fontSize="11px"
      >
        No shell command will be fabricated in the browser.
        <br />
        Adapter required; no executed code or evidence is presented until
        a backend is configured and connected.
      </Box>
    </Box>
  );
};