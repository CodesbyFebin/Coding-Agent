'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { PILLAR_CATEGORIES, ALL_PILLARS } from '../../../frontend/src/data/pillarsData';
// Public, indexable directory of the 80 sovereign engineering pillars.
// Mirrors the reference marketing build's PillarDirectory (search + category
// filter) rendered in the app's sovereign dark theme.
export const PillarsDirectoryPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PILLAR_CATEGORIES.map((cat) => {
      if (category !== 'all' && cat.id !== category) {
        return { ...cat, items: [] };
      }
      const items = cat.items.filter((item) => {
        if (!q) {return true;}
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q) ||
          (item.rationale?.toLowerCase().includes(q) ?? false) ||
          (item.searchKeywords?.some((k) => k.toLowerCase().includes(q)) ??
            false) ||
          (item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
        );
      });
      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [query, category]);

  const totalMatches = filtered.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <Box maxW="1280px" mx="auto">
      <Text
        fontFamily="mono"
        fontSize={{ base: '10px', md: '12px' }}
        fontWeight={900}
        letterSpacing="0.35em"
        color="sovereign.flame"
        textTransform="uppercase"
        mb={3}
      >
        ■ PILLAR DIRECTORY // {ALL_PILLARS.length} ARCHITECTURAL MODULES
      </Text>

      <Heading
        as="h1"
        fontFamily="heading"
        fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
        fontWeight={900}
        letterSpacing="-0.03em"
        textTransform="uppercase"
        lineHeight={0.95}
        mb={4}
      >
        Pillars of{' '}
        <Box
          as="span"
          bg="sovereign.flame"
          color="black"
          px={2}
          display="inline-block"
        >
          Agentic Engineering
        </Box>
      </Heading>

      <Text
        fontFamily="mono"
        fontSize={{ base: 'xs', md: 'sm' }}
        color="sovereign.muted"
        maxW="2xl"
        lineHeight="1.7"
        mb={8}
      >
        The complete knowledge graph of CodingAgent.in — each pillar is a
        first-class entity for AI search, answer engines, and sovereign
        developer workflows, with explicit verification aspects and rationale.
      </Text>

      {/* Search */}
      <Box position="relative" maxW="xl" mb={4}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#596771',
          }}
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH PILLARS (TOOL, CONCEPT, KEYWORD, DPDP, MCP)…"
          aria-label="Search pillars"
          pl="42px"
          pr="70px"
          h="46px"
          bg="sovereign.panel"
          border="1px solid"
          borderColor="sovereign.line2"
          rounded="10px"
          fontFamily="mono"
          fontSize="11px"
          fontWeight={700}
          textTransform="uppercase"
          _placeholder={{ color: 'sovereign.dim' }}
        />
        {query && (
          <Button
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            size="xs"
            variant="ghost"
            fontFamily="mono"
            fontWeight={900}
            textTransform="uppercase"
            color="sovereign.flame"
            onClick={() => setQuery('')}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Category filters */}
      <Flex flexWrap="wrap" gap={2} mb={8}>
        <CategoryPill
          label={`All Pillars (${ALL_PILLARS.length})`}
          active={category === 'all'}
          onClick={() => setCategory('all')}
        />
        {PILLAR_CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={`${cat.label} (${cat.items.length})`}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          />
        ))}
      </Flex>

      {query && (
        <Text
          fontFamily="mono"
          fontSize="11px"
          fontWeight={900}
          textTransform="uppercase"
          color="sovereign.flame"
          mb={6}
        >
          Showing {totalMatches} of {ALL_PILLARS.length} pillars matching "
          {query}"
        </Text>
      )}

      {filtered.length === 0 ? (
        <Box
          border="1px solid"
          borderColor="sovereign.line2"
          rounded="12px"
          p={10}
          textAlign="center"
          bg="sovereign.panel"
        >
          <Text fontFamily="mono" fontWeight={700} textTransform="uppercase" mb={3}>
            No pillars found matching "{query}"
          </Text>
          <Button
            size="sm"
            fontFamily="mono"
            fontWeight={900}
            textTransform="uppercase"
            color="sovereign.flame"
            variant="ghost"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            Reset search and filter
          </Button>
        </Box>
      ) : (
        <VStack align="stretch" spacing={12}>
          {filtered.map((group) => (
            <Box key={group.id}>
              <Flex
                align="center"
                justify="space-between"
                pb={2}
                mb={4}
                borderBottom="1px solid"
                borderColor="sovereign.line"
              >
                <Heading
                  as="h2"
                  fontFamily="heading"
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight={900}
                  textTransform="uppercase"
                  letterSpacing="0.12em"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box as="span" color="sovereign.flame">
                    ■
                  </Box>
                  {group.label}
                </Heading>
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  fontWeight={900}
                  textTransform="uppercase"
                  px={2}
                  py={1}
                  bg="sovereign.flame"
                  color="black"
                  rounded="4px"
                >
                  {group.items.length} PILLARS
                </Text>
              </Flex>

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {group.items.map((pillar) => (
                  <PillarCard key={pillar.id} pillar={pillar} />
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

const CategoryPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    size="xs"
    onClick={onClick}
    px={3}
    py={1.5}
    h="auto"
    rounded="6px"
    border="1px solid"
    borderColor={active ? 'sovereign.flame' : 'sovereign.line'}
    bg={active ? 'sovereign.flame' : 'transparent'}
    color={active ? 'black' : 'sovereign.muted'}
    fontFamily="mono"
    fontWeight={900}
    textTransform="uppercase"
    letterSpacing="0.08em"
    whiteSpace="nowrap"
    _hover={{ color: active ? 'black' : 'sovereign.text' }}
  >
    {label}
  </Button>
);

const PillarCard = ({ pillar }: { pillar: (typeof ALL_PILLARS)[number] }) => {
  // Canonical pillar URLs are the top-level slug form (/dpdp-compliance);
  // the /pillars/:slug form 308-redirects here from the edge.
  const href = pillar.href;
  return (
    <Link
      href={href}
      {...(pillar.external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      style={{ textDecoration: 'none' }}
    >
      <Box
        as="article"
        h="full"
        p={4}
        border="1px solid"
        borderColor="sovereign.line"
        bg="sovereign.panel"
        rounded="10px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        transition="all 0.15s"
        _hover={{ bg: '#141b22', borderColor: 'sovereign.flame' }}
      >
        <Box>
          <Text
            fontFamily="mono"
            fontSize="9px"
            fontWeight={700}
            textTransform="uppercase"
            color="sovereign.dim"
            mb={1.5}
          >
            {pillar.href}
          </Text>
          <Text
            fontFamily="heading"
            fontWeight={900}
            fontSize="sm"
            textTransform="uppercase"
            lineHeight="snug"
            mb={1.5}
            noOfLines={2}
          >
            {pillar.label}
          </Text>
          <Text
            fontSize="11px"
            fontFamily="mono"
            color="sovereign.muted"
            noOfLines={3}
            lineHeight="1.6"
          >
            {pillar.description}
          </Text>
        </Box>
        <Flex
          justify="space-between"
          align="center"
          mt={3}
          pt={2.5}
          borderTop="1px solid"
          borderColor="sovereign.line"
          fontFamily="mono"
          fontSize="10px"
          fontWeight={700}
        >
          <Text textTransform="uppercase" color="sovereign.dim" isTruncated>
            {pillar.category}
          </Text>
          <Text color="sovereign.flame" fontWeight={900} ml={2}>
            {pillar.external ? '↗' : '→'}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};
