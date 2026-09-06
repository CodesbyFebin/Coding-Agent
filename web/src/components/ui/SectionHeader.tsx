'use client';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';

// Shared flame-branded section header for the public knowledge pages,
// matching the PillarsDirectoryPage heading treatment (■ eyebrow + display
// headline + mono description).
export const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
}) => (
  <Box mb={{ base: 6, md: 10 }}>
    <Text
      fontFamily="mono"
      fontSize={{ base: '10px', md: '12px' }}
      fontWeight={900}
      letterSpacing="0.35em"
      color="sovereign.flame"
      textTransform="uppercase"
      mb={3}
    >
      ■ {eyebrow}
    </Text>
    <Heading
      as="h1"
      fontFamily="heading"
      fontSize={{ base: '3xl', md: '5xl' }}
      fontWeight={900}
      letterSpacing="-0.03em"
      textTransform="uppercase"
      lineHeight={0.98}
      mb={4}
    >
      {title}
      {highlight && (
        <>
          {' '}
          <Box
            as="span"
            bg="sovereign.flame"
            color="black"
            px={2}
            display="inline-block"
          >
            {highlight}
          </Box>
        </>
      )}
    </Heading>
    {description && (
      <Text
        fontFamily="mono"
        fontSize={{ base: 'xs', md: 'sm' }}
        color="sovereign.muted"
        maxW="2xl"
        lineHeight="1.7"
      >
        {description}
      </Text>
    )}
  </Box>
);

export const KVCard = ({
  heading,
  rows,
}: {
  heading: string;
  rows: [string, string][];
}) => (
  <Box
    border="1px solid"
    borderColor="sovereign.line"
    bg="sovereign.panel"
    rounded="10px"
    p={4}
    flex={1}
    minW={{ base: 'full', md: '280px' }}
  >
    <Text fontFamily="heading" fontWeight={800} fontSize="sm" mb={3}>
      {heading}
    </Text>
    {rows.map(([k, v]) => (
      <Flex
        key={k}
        justify="space-between"
        gap={3}
        py="6px"
        borderBottom="1px solid"
        borderColor="sovereign.line"
        _last={{ border: 'none' }}
        fontSize="11px"
        fontFamily="mono"
      >
        <Text color="sovereign.dim" flexShrink={0}>
          {k}
        </Text>
        <Text color="sovereign.muted" textAlign="right">
          {v}
        </Text>
      </Flex>
    ))}
  </Box>
);
