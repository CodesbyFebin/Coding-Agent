'use client';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { FAQ_ITEMS } from '../../../frontend/src/data/localRuntimesData';
import { SectionHeader } from '../../components/ui/SectionHeader';
// Public FAQ page rendered with native <details>/<summary> so every
// question/answer pair is directly extractable by answer engines — matching
// the FAQPage JSON-LD shipped in index.html.
export const FaqPage = () => {

  return (
    <Box maxW="860px" mx="auto">
      <SectionHeader
        eyebrow="FAQ // DIRECT ANSWERS"
        title="Frequently asked"
        highlight="questions"
        description="Plain answers about the platform, its architecture and its honest boundaries — no fabricated live-status claims."
      />

      <Flex flexDirection="column" gap={3}>
        {FAQ_ITEMS.map((item) => (
          <Box
            key={item.id}
            as="details"
            border="1px solid"
            borderColor="sovereign.line"
            bg="sovereign.panel"
            rounded="10px"
            overflow="hidden"
            _open={{ borderColor: 'sovereign.line2' }}
          >
            <Box
              as="summary"
              px={4}
              py={3.5}
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={3}
              _hover={{ bg: '#10151b' }}
            >
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="sm"
                fontWeight={800}
                textTransform="uppercase"
                letterSpacing="0.02em"
              >
                {item.question}
              </Heading>
              <Text
                as="span"
                fontFamily="mono"
                color="sovereign.flame"
                fontWeight={900}
                flexShrink={0}
                aria-hidden
              >
                +
              </Text>
            </Box>
            <Box px={4} pb={4}>
              <Text fontSize="sm" color="sovereign.muted" lineHeight="1.8">
                {item.answer}
              </Text>
              <Text
                fontFamily="mono"
                fontSize="9px"
                color="sovereign.dim"
                textTransform="uppercase"
                mt={2}
              >
                {item.category}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
