'use client';
import Link from 'next/link';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { ALL_PILLARS, PILLAR_CATEGORIES } from '../../../frontend/src/data/pillarsData';
import { getEditorial, isContentIndexable } from '../../../frontend/src/content/registry';
// First-class, indexable page for a single sovereign engineering pillar.
// Renders the pillar's description, rationale, verification aspect, related
// pillars and search keywords — the content model from the reference
// marketing build, in the app's sovereign dark theme.
export const PillarDetailPage = ({ slug }: { slug: string }) => {
  const pillar = ALL_PILLARS.find((p) => p.href === `/${slug}`);
  const editorial = pillar ? getEditorial(pillar.id) : undefined;
  const indexable = pillar ? isContentIndexable(pillar.id) : false;

  if (!pillar) {
    return (
      <Box maxW="680px" mx="auto" pt={{ base: 4, md: 10 }}>
        <Heading as="h1" size="lg" fontFamily="heading" mb={3}>
          Pillar not found
        </Heading>
        <Text color="sovereign.muted" mb={6}>
          No architectural pillar exists at /{slug}.
        </Text>
        <Button
          as={Link}
          href="/pillars"
          colorScheme="brand"
          leftIcon={<ArrowLeft size={16} />}
        >
          Browse the Pillar Directory
        </Button>
      </Box>
    );
  }

  const related = (pillar.relatedPillarIds ?? [])
    .map((id) => ALL_PILLARS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const category = PILLAR_CATEGORIES.find(
    (c) => c.items.some((i) => i.id === pillar.id)
  );

  return (
    <Box maxW="860px" mx="auto">
      {/* Breadcrumb */}
      <HStack
        as="nav"
        aria-label="Breadcrumb"
        fontFamily="mono"
        fontSize="10px"
        fontWeight={800}
        textTransform="uppercase"
        letterSpacing="0.12em"
        color="sovereign.dim"
        mb={5}
        flexWrap="wrap"
      >
        <Link href="/" style={{ color: 'inherit' }}>
          CodingAgent.in
        </Link>
        <span aria-hidden>/</span>
        <Link href="/pillars" style={{ color: 'inherit' }}>
          Pillars
        </Link>
        <span aria-hidden>/</span>
        <Text color="sovereign.flame">{pillar.category}</Text>
      </HStack>

      <Text
        fontFamily="mono"
        fontSize="11px"
        fontWeight={900}
        letterSpacing="0.3em"
        textTransform="uppercase"
        color="sovereign.flame"
        mb={2}
      >
        {pillar.href} {pillar.external ? '// EXTERNAL' : ''}
      </Text>

      <Heading
        as="h1"
        fontFamily="heading"
        fontSize={{ base: '3xl', md: '5xl' }}
        fontWeight={900}
        letterSpacing="-0.03em"
        textTransform="uppercase"
        lineHeight={0.95}
        mb={4}
      >
        {pillar.label}
      </Heading>

      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        color="sovereign.text"
        lineHeight="1.7"
        mb={8}
      >
        {pillar.description}
      </Text>

      {editorial && (
        <>
          <Box
            p={5}
            border="1px solid"
            borderColor="sovereign.line"
            borderLeftWidth="3px"
            borderLeftColor="sovereign.flame"
            bg="sovereign.panel"
            rounded="10px"
            mb={8}
          >
            <Text
              fontFamily="mono"
              fontSize="10px"
              fontWeight={900}
              textTransform="uppercase"
              letterSpacing="0.2em"
              color="sovereign.flame"
              mb={2}
            >
              Editorial · Updated {editorial.updated}
            </Text>
            <Text fontSize="md" color="sovereign.text" lineHeight="1.8">
              {editorial.definition}
            </Text>
          </Box>

          {editorial.sections.map((section) => (
            <Box key={section.heading} as="section" mb={8}>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight={900}
                textTransform="uppercase"
                mb={3}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Box as="span" color="sovereign.flame">
                  ■
                </Box>
                {section.heading}
              </Heading>
              {section.paragraphs.map((p, i) => (
                <Text key={i} fontSize="sm" color="sovereign.muted" lineHeight="1.9" mb={3}>
                  {p}
                </Text>
              ))}
              {section.bullets && (
                <VStack align="stretch" spacing={2} mt={3}>
                  {section.bullets.map((b, i) => (
                    <Flex key={i} gap={2} fontSize="xs" fontFamily="mono" color="sovereign.muted" lineHeight="1.7">
                      <Text as="span" color="sovereign.flame" fontWeight={900}>
                        ■
                      </Text>
                      <Text>{b}</Text>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          ))}

          {editorial.faq.length > 0 && (
            <Box as="section" mb={8}>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight={900}
                textTransform="uppercase"
                mb={3}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Box as="span" color="sovereign.flame">
                  ■
                </Box>
                Questions and answers
              </Heading>
              <VStack align="stretch" spacing={2}>
                {editorial.faq.map((f) => (
                  <Box
                    key={f.question}
                    as="details"
                    border="1px solid"
                    borderColor="sovereign.line"
                    bg="sovereign.panel"
                    rounded="10px"
                  >
                    <Box
                      as="summary"
                      px={4}
                      py={3}
                      cursor="pointer"
                      fontFamily="heading"
                      fontWeight={800}
                      fontSize="sm"
                      _hover={{ bg: '#10151b' }}
                    >
                      {f.question}
                    </Box>
                    <Text px={4} pb={4} fontSize="sm" color="sovereign.muted" lineHeight="1.8">
                      {f.answer}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {editorial.sources && editorial.sources.length > 0 && (
            <Box as="section" mb={8}>
              <Heading
                as="h2"
                fontFamily="heading"
                fontSize="md"
                fontWeight={900}
                textTransform="uppercase"
                mb={3}
              >
                Sources
              </Heading>
              <VStack align="flex-start" spacing={1}>
                {editorial.sources.map((s) => (
                  <Text key={s.href} as="span" fontFamily="mono" fontSize="xs">
                    —{' '}
                    <a
                      href={s.href}
                      target={s.href.startsWith('http') ? '_blank' : undefined}
                      rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ color: '#6aa9ff' }}
                    >
                      {s.label}
                    </a>
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </>
      )}

      {!editorial && (
        <Box
          p={4}
          mb={8}
          border="1px dashed"
          borderColor="sovereign.line2"
          rounded="10px"
          fontFamily="mono"
          fontSize="11px"
          color="sovereign.dim"
        >
          IN PROGRESS — the long-form editorial for this pillar is being
          authored. This page is not indexed until it is complete.
        </Box>
      )}

      <VStack align="stretch" spacing={5} mb={10}>
        {pillar.rationale && (
          <ContentBlock
            label="Rationale"
            body={pillar.rationale}
            accent="sovereign.blue"
          />
        )}
        {pillar.verificationAspect && (
          <ContentBlock
            label="Verification aspect"
            body={pillar.verificationAspect}
            accent="sovereign.good"
            icon={<ShieldCheck size={14} aria-hidden />}
          />
        )}
      </VStack>

      {pillar.tags && pillar.tags.length > 0 && (
        <Flex flexWrap="wrap" gap={2} mb={10}>
          {pillar.tags.map((tag) => (
            <Text
              key={tag}
              fontFamily="mono"
              fontSize="10px"
              fontWeight={800}
              textTransform="uppercase"
              px={2.5}
              py={1}
              border="1px solid"
              borderColor="sovereign.line2"
              rounded="full"
              color="sovereign.muted"
            >
              {tag}
            </Text>
          ))}
        </Flex>
      )}

      {related.length > 0 && (
        <Box mb={10}>
          <Heading
            as="h2"
            fontFamily="heading"
            fontSize="md"
            fontWeight={900}
            textTransform="uppercase"
            letterSpacing="0.12em"
            mb={4}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Box as="span" color="sovereign.flame">
              ■
            </Box>
            Related pillars
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {related.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                {...(r.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  p={3.5}
                  border="1px solid"
                  borderColor="sovereign.line"
                  bg="sovereign.panel"
                  rounded="10px"
                  _hover={{ borderColor: 'sovereign.flame' }}
                >
                  <Text
                    fontFamily="heading"
                    fontWeight={800}
                    fontSize="sm"
                    textTransform="uppercase"
                    mb={1}
                  >
                    {r.label}
                  </Text>
                  <Text
                    fontSize="11px"
                    fontFamily="mono"
                    color="sovereign.muted"
                    noOfLines={2}
                  >
                    {r.description}
                  </Text>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* CTA */}
      <Flex
        flexWrap="wrap"
        gap={0}
        border="1px solid"
        borderColor="sovereign.line2"
        rounded="12px"
        overflow="hidden"
        mb={10}
      >
        <Button
          as={Link}
          href="/pillars"
          h="56px"
          px={8}
          rounded={0}
          bg="sovereign.flame"
          color="black"
          fontFamily="heading"
          fontWeight={900}
          textTransform="uppercase"
          letterSpacing="0.2em"
          fontSize="11px"
          _hover={{ bg: 'sovereign.accent' }}
          rightIcon={<ArrowRight size={15} />}
          flex={1}
        >
          Explore all pillars
        </Button>
        {pillar.external && pillar.href.startsWith('http') ? (
          <Button
            as="a"
            href={pillar.href}
            target="_blank"
            rel="noopener noreferrer"
            h="56px"
            px={8}
            rounded={0}
            borderTop="0"
            borderLeft="1px solid"
            borderColor="sovereign.line2"
            bg="transparent"
            color="sovereign.text"
            fontFamily="heading"
            fontWeight={900}
            textTransform="uppercase"
            letterSpacing="0.2em"
            fontSize="11px"
            _hover={{ bg: '#141b22' }}
            rightIcon={<ExternalLink size={14} />}
            flex={1}
          >
            Open {pillar.label}
          </Button>
        ) : (
          <Button
            as="a"
            href="https://app.codingagent.in/"
            target="_blank"
            rel="noopener noreferrer"
            h="56px"
            px={8}
            rounded={0}
            borderLeft="1px solid"
            borderColor="sovereign.line2"
            bg="transparent"
            color="sovereign.text"
            fontFamily="heading"
            fontWeight={900}
            textTransform="uppercase"
            letterSpacing="0.2em"
            fontSize="11px"
            _hover={{ bg: '#141b22' }}
            flex={1}
          >
            ▶ Launch console
          </Button>
        )}
      </Flex>

      {category && (
        <Text fontFamily="mono" fontSize="11px" color="sovereign.dim" mb={2}>
          Filed under {category.label} — {category.description}
        </Text>
      )}
    </Box>
  );
};

const ContentBlock = ({
  label,
  body,
  accent,
  icon,
}: {
  label: string;
  body: string;
  accent: string;
  icon?: React.ReactNode;
}) => (
  <Box
    p={5}
    border="1px solid"
    borderColor="sovereign.line"
    borderLeftWidth="3px"
    borderLeftColor={accent}
    bg="sovereign.panel"
    rounded="10px"
  >
    <Text
      fontFamily="mono"
      fontSize="10px"
      fontWeight={900}
      textTransform="uppercase"
      letterSpacing="0.2em"
      color={accent}
      mb={2}
      display="flex"
      alignItems="center"
      gap={1.5}
    >
      {icon}
      {label}
    </Text>
    <Text fontSize="sm" color="sovereign.muted" lineHeight="1.75">
      {body}
    </Text>
  </Box>
);
