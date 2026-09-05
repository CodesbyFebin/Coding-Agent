import { Box, Text, Flex } from '@chakra-ui/react';

// Runtime-truth pill. Mirrors the prototype's `.pill.good/.warn/.bad/.unknown`
// indicator. It only ever reflects what it is told: callers pass the kind and
// label computed from real backend/auth state — this component never fabricates
// a green state on its own.
export type TruthKind = 'good' | 'warn' | 'bad' | 'unknown';

const KIND_STYLES: Record<TruthKind, { color: string; border: string }> = {
  good: { color: 'sovereign.good', border: '#24533a' },
  warn: { color: 'sovereign.warn', border: '#584720' },
  bad: { color: 'sovereign.bad', border: '#5d3232' },
  unknown: { color: 'sovereign.muted', border: 'sovereign.line2' },
};

interface TruthPillProps {
  kind: TruthKind;
  label: string;
  size?: 'sm' | 'md';
}

export const TruthPill = ({ kind, label, size = 'md' }: TruthPillProps) => {
  const s = KIND_STYLES[kind];
  return (
    <Flex
      align="center"
      gap="6px"
      border="1px solid"
      borderColor={s.border}
      rounded="999px"
      px={2}
      py={size === 'sm' ? '3px' : '5px'}
      color={s.color}
      fontFamily="mono"
      fontWeight="800"
      fontSize={size === 'sm' ? '8px' : '9px'}
      letterSpacing="0.05em"
      whiteSpace="nowrap"
    >
      <Box
        w="6px"
        h="6px"
        rounded="full"
        bg="currentColor"
        flexShrink={0}
        aria-hidden
      />
      <Text as="span">{label}</Text>
    </Flex>
  );
};
