import { useState } from 'react';
import { Box, Heading, Text, Flex, Input, Button, HStack } from '@chakra-ui/react';
import { Check, AlertTriangle, XOctagon, Search } from 'lucide-react';
import { SECURITY_RULES } from '../../data/architectureData';
import type { PostureType } from '../../types';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

// Public security-policy matrix: the ALLOW / ASK / DENY posture table from
// the reference build, with posture filters and search. States exactly which
// agent capabilities are automatic, which require an operator, and which are
// denied outright.
const POSTURE_STYLE: Record<
  PostureType,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  ALLOW: { bg: 'rgba(51,209,122,0.12)', color: 'sovereign.good', icon: <Check size={11} strokeWidth={3} aria-hidden /> },
  ASK: { bg: 'rgba(245,185,66,0.12)', color: 'sovereign.warn', icon: <AlertTriangle size={11} strokeWidth={3} aria-hidden /> },
  DENY: { bg: 'rgba(255,107,107,0.12)', color: 'sovereign.bad', icon: <XOctagon size={11} strokeWidth={3} aria-hidden /> },
};

export const SecurityMatrixPage = () => {
  const [posture, setPosture] = useState<'ALL' | PostureType>('ALL');
  const [query, setQuery] = useState('');

  useDocumentMeta(
    'Security Matrix — ALLOW / ASK / DENY Policy Posture | CodingAgent.in',
    'Autonomy without unbounded authority: the CodingAgent.in permission matrix showing ALLOW, ASK and DENY postures for filesystem, network, git, deploy, database, shell and secrets capabilities — with rationale and mitigation for each.'
  );

  const rules = SECURITY_RULES.filter((rule) => {
    const matchesPosture = posture === 'ALL' || rule.posture === posture;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      rule.capability.toLowerCase().includes(q) ||
      rule.example.toLowerCase().includes(q) ||
      rule.why.toLowerCase().includes(q);
    return matchesPosture && matchesQuery;
  });

  return (
    <Box maxW="1280px" mx="auto">
      <SectionHeader
        eyebrow="SECURITY & SOVEREIGNTY // POLICY MATRIX"
        title="Autonomy without"
        highlight="unbounded authority"
        description="Agentic engineering is powerful precisely because agents can act. Permissions, sandboxing, secrets, network access, approvals and verification belong in the architecture — not as post-launch hardening."
      />

      <Flex flexWrap="wrap" justify="space-between" gap={3} mb={6}>
        <HStack spacing={1.5}>
          {(['ALL', 'ALLOW', 'ASK', 'DENY'] as const).map((p) => (
            <Button
              key={p}
              size="xs"
              onClick={() => setPosture(p)}
              px={3}
              py={1.5}
              h="auto"
              rounded="6px"
              border="1px solid"
              borderColor={posture === p ? (p === 'ASK' ? 'sovereign.flame' : 'sovereign.text') : 'sovereign.line'}
              bg={posture === p ? (p === 'ASK' ? 'sovereign.flame' : 'sovereign.text') : 'transparent'}
              color={posture === p ? (p === 'ASK' ? 'black' : 'sovereign.bg') : 'sovereign.muted'}
              fontFamily="mono"
              fontWeight={900}
              textTransform="uppercase"
              _hover={{ color: posture === p ? undefined : 'sovereign.text' }}
            >
              {p}
              {p !== 'ALL' &&
                ` (${SECURITY_RULES.filter((r) => r.posture === p).length})`}
            </Button>
          ))}
        </HStack>

        <Box position="relative">
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#596771',
            }}
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PERMISSIONS…"
            aria-label="Search permissions"
            pl="32px"
            pr={3}
            h="34px"
            w={{ base: 'full', md: '240px' }}
            bg="sovereign.panel"
            border="1px solid"
            borderColor="sovereign.line"
            rounded="8px"
            fontFamily="mono"
            fontSize="11px"
            fontWeight={700}
            textTransform="uppercase"
            _placeholder={{ color: 'sovereign.dim' }}
          />
        </Box>
      </Flex>

      {rules.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="sovereign.line2"
          rounded="12px"
          p={10}
          textAlign="center"
          color="sovereign.dim"
          fontFamily="mono"
          fontSize="xs"
        >
          No capabilities match the current filter.
        </Box>
      ) : (
        <Box
          overflowX="auto"
          border="1px solid"
          borderColor="sovereign.line"
          rounded="12px"
          bg="sovereign.panel"
        >
          {rules.map((rule, idx) => {
            const style = POSTURE_STYLE[rule.posture];
            return (
              <Flex
                key={idx}
                gap={4}
                px={{ base: 4, md: 5 }}
                py={4}
                borderBottom="1px solid"
                borderColor="sovereign.line"
                _last={{ border: 'none' }}
                flexDirection={{ base: 'column', md: 'row' }}
                _hover={{ bg: '#10151b' }}
              >
                <Box minW={{ base: 'auto', md: '190px' }} flexShrink={0}>
                  <Text fontFamily="heading" fontWeight={900} fontSize="sm" textTransform="uppercase">
                    {rule.capability}
                  </Text>
                  <Text
                    as="code"
                    fontFamily="mono"
                    fontSize="10px"
                    color="sovereign.muted"
                    bg="rgba(255,255,255,0.05)"
                    px={1.5}
                    py={0.5}
                    rounded="4px"
                    display="inline-block"
                    mt={1}
                  >
                    {rule.example}
                  </Text>
                </Box>
                <Box flexShrink={0} minW={{ base: 'auto', md: '90px' }}>
                  <Flex
                    align="center"
                    gap={1}
                    fontFamily="mono"
                    fontWeight={900}
                    fontSize="10px"
                    px={2}
                    py={1}
                    rounded="6px"
                    textTransform="uppercase"
                    bg={style.bg}
                    color={style.color}
                    w="fit-content"
                  >
                    {style.icon}
                    {rule.posture}
                  </Flex>
                  <Text
                    fontFamily="mono"
                    fontSize="9px"
                    color="sovereign.dim"
                    mt={1}
                    textTransform="uppercase"
                  >
                    risk · {rule.riskClass}
                  </Text>
                </Box>
                <Box flex={1} minW={0}>
                  <Text fontSize="xs" color="sovereign.text" fontWeight={600} lineHeight="1.7">
                    {rule.why}
                  </Text>
                  <Text fontSize="11px" fontFamily="mono" color="sovereign.muted" mt={1} lineHeight="1.6">
                    <Text as="span" color="sovereign.flame" fontWeight={900} textTransform="uppercase">
                      Mitigation:{' '}
                    </Text>
                    {rule.mitigation}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Box>
      )}

      <Heading
        as="h2"
        fontFamily="heading"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight={900}
        textTransform="uppercase"
        mt={10}
        mb={2}
      >
        Default-deny by construction
      </Heading>
      <Text fontFamily="mono" fontSize="xs" color="sovereign.muted" maxW="2xl" lineHeight="1.8">
        Any undeclared, non-schema-validated tool invocation is inherently
        untrusted and is denied. Capabilities must be explicitly declared,
        validated, and granted — the same truth boundary that keeps UNKNOWN,
        UNAVAILABLE and BLOCKED states honest in the product UI.
      </Text>
    </Box>
  );
};
