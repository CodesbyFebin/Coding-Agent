import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

// Right inspector rail skeleton. Phase 6 wires the four panels to real data
// (Activity reads the SSE singleton, Approvals calls the decision endpoint,
// Runtime reflects backend-truth kvs); for now the tab structure and honest
// empty panels render so the layout is complete and navigable.
type Panel = 'activity' | 'evidence' | 'approvals' | 'runtime';

const TABS: { id: Panel; label: string }[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'runtime', label: 'Runtime' },
];

export const Inspector = () => {
  const [active, setActive] = useState<Panel>('activity');

  return (
    <Box
      as="aside"
      aria-label="Inspector"
      borderLeft="1px solid"
      borderColor="sovereign.line"
      bg="#0b0e12"
      gridTemplateRows="42px 1fr"
      minW={0}
      display={{ base: 'none', xl: 'grid' }}
    >
      <Flex borderBottom="1px solid" borderColor="sovereign.line" px={2} align="center">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Box
              as="button"
              key={tab.id}
              onClick={() => setActive(tab.id)}
              bg="transparent"
              border="0"
              borderBottom="2px solid"
              borderColor={isActive ? 'sovereign.accent' : 'transparent'}
              color={isActive ? 'sovereign.accent' : 'sovereign.muted'}
              px="10px"
              fontWeight="750"
              fontSize="11px"
              h="42px"
              cursor="pointer"
              _hover={{ color: 'sovereign.text' }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Flex>

      <Box overflowY="auto" p={3}>
        {active === 'activity' && <EmptyPanel text="No persisted events loaded." />}
        {active === 'evidence' && (
          <EmptyPanel text="Evidence appears here only after a backend execution records it." />
        )}
        {active === 'approvals' && <EmptyPanel text="No pending approvals." />}
        {active === 'runtime' && <RuntimeSkeleton />}
      </Box>
    </Box>
  );
};

const EmptyPanel = ({ text }: { text: string }) => (
  <Box
    border="1px dashed"
    borderColor="sovereign.line2"
    rounded="12px"
    p={4}
    color="sovereign.dim"
    fontSize="12px"
  >
    {text}
  </Box>
);

const RuntimeSkeleton = () => (
  <Box
    border="1px solid"
    borderColor="sovereign.line"
    bg="sovereign.panel"
    rounded="12px"
    p={4}
  >
    <Text fontSize="13px" fontWeight={700} mb={2}>
      Runtime truth
    </Text>
    {[
      ['Base backend', 'UNKNOWN'],
      ['Auth', 'SIGNED_OUT'],
      ['Model provider', 'UNAVAILABLE'],
      ['Tool gateway', 'UNAVAILABLE'],
      ['MCP', 'UNAVAILABLE'],
      ['Sandbox', 'UNAVAILABLE'],
    ].map(([k, v]) => (
      <Flex
        key={k}
        justify="space-between"
        py="7px"
        borderBottom="1px solid"
        borderColor="sovereign.line"
        fontSize="10px"
      >
        <Text fontFamily="mono" color="sovereign.dim">
          {k}
        </Text>
        <Text fontFamily="mono" color={v.includes('UNAVAILABLE') ? 'sovereign.dim' : 'sovereign.muted'}>
          {v}
        </Text>
      </Flex>
    ))}
  </Box>
);
