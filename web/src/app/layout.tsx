import type { Metadata } from 'next';
import { Providers } from './providers';
import Link from 'next/link';
import { ALL_PILLARS } from '../../../frontend/src/data/pillarsData';

export const metadata: Metadata = {
  metadataBase: new URL('https://codingagent.in'),
  title: {
    default: 'CodingAgent.in — Sovereign AI Coding Agents & Agentic Engineering',
    template: '%s | CodingAgent.in',
  },
  description:
    'CodingAgent.in is a sovereign, open-source, local-LLM-first agentic engineering platform for AI coding agents, MCP-native tooling, and verification-first workflows.',
  keywords: [
    'best AI coding agent for developers 2026',
    'autonomous coding assistant',
    'AI coding agent India',
    'sovereign AI coding agent',
    'local LLM coding agent Ollama',
    'best MCP server for AI coding agents',
    'verification-first AI coding',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'CodingAgent.in',
    url: 'https://codingagent.in/',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'CodingAgent.in',
              url: 'https://codingagent.in/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://codingagent.in/pillars?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <Box_Shell>{children}</Box_Shell>
        </Providers>
      </body>
    </html>
  );
}

import { Box, Flex, Text, Button } from '@chakra-ui/react';

function Box_Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100dvh"
      display="grid"
      gridTemplateRows="auto 1fr auto"
      bg="sovereign.bg"
      color="sovereign.text"
    >
      <Flex
        as="header"
        h="52px"
        align="center"
        gap="10px"
        px={{ base: '10px', md: '14px' }}
        borderBottom="1px solid"
        borderColor="sovereign.line"
        bg="#0b0e12"
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            fontWeight: 900,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            w="26px"
            h="26px"
            rounded="8px"
            bg="linear-gradient(135deg,#ff5a1f,#ff8a4c)"
            display="grid"
            placeItems="center"
            color="white"
            fontFamily="mono"
            fontWeight={900}
            fontSize="11px"
            aria-hidden
          >
            CA
          </Box>
          <Text fontWeight={900} fontSize="15px">
            Coding
            <Text as="span" color="sovereign.accent">
              Agent
            </Text>
          </Text>
        </Link>
        <Flex
          as="nav"
          aria-label="Knowledge"
          gap="14px"
          ml="auto"
          align="center"
          display={{ base: 'none', lg: 'flex' }}
          fontFamily="mono"
          fontSize="11px"
          fontWeight={800}
          textTransform="uppercase"
        >
          {[
            ['/platform', 'Platform'],
            ['/agent-modes', 'Modes'],
            ['/local-runtimes', 'Runtimes'],
            ['/security-matrix', 'Security'],
            ['/pillars', 'Pillars'],
            ['/faq', 'FAQ'],
          ].map(([to, label]) => (
            <Link key={to} href={to} style={{ color: '#8b99a4', textDecoration: 'none' }}>
              <Text _hover={{ color: 'sovereign.accent' }}>{label}</Text>
            </Link>
          ))}
        </Flex>
        <Flex gap="8px" ml={{ base: 'auto', lg: '10px' }} align="center">
          <Button
            as="a"
            href="https://app.codingagent.in/"
            size="sm"
            h="34px"
            bg="sovereign.accent"
            color="white"
            rounded="8px"
            fontFamily="mono"
            fontWeight={800}
            fontSize="11px"
            textTransform="uppercase"
            _hover={{ bg: 'sovereign.accent2' }}
          >
            ▶ Launch Console
          </Button>
          <Button
            as="a"
            href="https://app.codingagent.in/login"
            size="sm"
            h="34px"
            variant="ghost"
            border="1px solid"
            borderColor="sovereign.line2"
            rounded="8px"
            fontFamily="mono"
            fontWeight={800}
            fontSize="11px"
            textTransform="uppercase"
            color="sovereign.text"
            _hover={{ borderColor: 'sovereign.accent' }}
          >
            Sign in
          </Button>
        </Flex>
      </Flex>

      <Box
        as="main"
        id="main"
        overflowY="auto"
        background="radial-gradient(circle at 60% -20%, rgba(255,90,31,0.06), transparent 36%), sovereign.bg"
      >
        {children}
      </Box>

      <Box
        as="footer"
        borderTop="1px solid"
        borderColor="sovereign.line"
        bg="#080b0f"
        px={{ base: 4, md: 6 }}
        py={6}
      >
        <VStack_Footer />
      </Box>
    </Box>
  );
}

import { Container, VStack } from '@chakra-ui/react';

function VStack_Footer() {
  return (
    <Container maxW="container.xl">
      <VStack align="flex-start" spacing={3}>
        <Text
          fontFamily="mono"
          fontSize="9px"
          fontWeight={800}
          textTransform="uppercase"
          letterSpacing="0.18em"
          color="sovereign.dim"
        >
          Sovereign · Local-LLM-First · MCP-Native
        </Text>
        <Flex gap={4} flexWrap="wrap" fontFamily="mono" fontSize="11px" fontWeight={700}>
          <Link href="/platform" style={{ color: '#8b99a4' }}>Platform</Link>
          <Link href="/agent-modes" style={{ color: '#8b99a4' }}>Agent Modes</Link>
          <Link href="/local-runtimes" style={{ color: '#8b99a4' }}>Local Runtimes</Link>
          <Link href="/security-matrix" style={{ color: '#8b99a4' }}>Security Matrix</Link>
          <Link href="/pillars" style={{ color: '#8b99a4' }}>
            Pillar Directory ({ALL_PILLARS.length})
          </Link>
          <Link href="/faq" style={{ color: '#8b99a4' }}>FAQ</Link>
          <a href="https://app.codingagent.in/" style={{ color: '#8b99a4' }}>Launch Console</a>
          <a
            href="https://github.com/CodesbyFebin/Coding-Agent"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8b99a4' }}
          >
            Source [GitHub]
          </a>
        </Flex>
        <Text fontFamily="mono" fontSize="10px" color="sovereign.dim">
          codingagent.in — authoritative backend required · verification-first agentic engineering
        </Text>
      </VStack>
    </Container>
  );
}
