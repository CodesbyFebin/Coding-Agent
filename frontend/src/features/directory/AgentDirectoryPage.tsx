import { useEffect, useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Heading, Input, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { apiClient } from '../../lib/api';

type Evidence = { id: string; dimension: string; claim: string; source_url: string; status: 'unreviewed'|'supported'|'contradicted'; reviewed_at: string|null };
type Governance = { supported: number; assessed: number; total: number; coveragePercent: number; label: string; dimensions: Record<string,string> };
type Agent = { id: string; slug: string; name: string; description: string; category: string; website_url: string|null; repository_url: string|null; governance: Governance; evidence: Evidence[] };
const dimensions = ['sandbox','audit','approvals','secrets','identity','privacy'];

export function AgentDirectoryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  useEffect(() => {
    let live = true;
    apiClient.get<{agents:Agent[]}>('/directory/agents').then(r => { if(live) setAgents(r.data.agents); })
      .catch(() => { if(live) setError('Directory API unavailable. Profiles and scores cannot be verified right now.'); })
      .finally(() => { if(live) setLoading(false); });
    return () => { live = false; };
  }, []);
  const visible = useMemo(() => agents.filter(a =>
    (category === 'all' || a.category === category) &&
    (a.name + ' ' + a.description).toLowerCase().includes(query.toLowerCase())
  ), [agents, category, query]);
  const compared = agents.filter(a => selected.includes(a.id));
  const current = agents.find(a => a.id === active);
  return <Box color="#e5e7eb" minH="60vh">
    <Badge mb={4} bg="#123322" color="#4ade80" px={3} py={1} borderRadius="full">Evidence-first · Source-linked · No simulated scores</Badge>
    <Heading as="h1" size="2xl" color="white" mb={3}>Sovereign AI Coding Agent <Text as="span" color="#4ade80">Directory</Text></Heading>
    <Text maxW="760px" color="#9ca3af" mb={7}>Explore coding agents and frameworks through source-linked governance assessments. Evidence coverage measures reviewed documentation, not software security or compliance certification.</Text>
    <SimpleGrid columns={{base:1,md:3}} spacing={3} mb={7}>
      {[['Published profiles',agents.length],['Source-linked claims',agents.reduce((n,a)=>n+a.evidence.length,0)],['Independent security certifications','Not assessed']].map(([label,value])=><Box key={String(label)} bg="#111517" border="1px solid #254033" p={4} borderRadius="lg"><Text fontSize="2xl" fontWeight="bold" color="#4ade80">{value}</Text><Text fontSize="sm" color="#9ca3af">{label}</Text></Box>)}
    </SimpleGrid>
    <Flex gap={3} mb={6} wrap="wrap">
      <Input aria-label="Search agents" placeholder="Search published agents..." value={query} onChange={e=>setQuery(e.target.value)} maxW="360px" bg="#101418" borderColor="#355042"/>
      {['all','agent','framework','enterprise'].map(c=><Button size="sm" key={c} onClick={()=>setCategory(c)} bg={category===c?'#166534':'#19201d'} color="white" _hover={{bg:'#15803d'}}>{c[0].toUpperCase()+c.slice(1)}</Button>)}
    </Flex>
    {loading && <Text role="status">Loading verified directory data…</Text>}
    {error && <Box role="alert" border="1px solid #9f4848" p={4} borderRadius="md" mb={4}>{error}</Box>}
    {!loading && !error && visible.length===0 && <Text color="#aab4ad">No published profiles match your search. No placeholder records are displayed.</Text>}
    <SimpleGrid columns={{base:1,md:2,lg:3}} spacing={4}>
      {visible.map(a=><Box key={a.id} bg="#101418" border="1px solid #2b4537" borderRadius="xl" p={5}>
        <Flex justify="space-between" gap={2} align="start"><Heading size="md" color="white">{a.name}</Heading><Badge colorScheme="green">{a.category}</Badge></Flex>
        <Text fontSize="sm" color="#a1aca5" my={3}>{a.description}</Text>
        <Text fontFamily="mono" color="#4ade80" fontWeight="bold">{a.governance.coveragePercent}% evidence coverage</Text>
        <Text fontSize="xs" color="#a1aca5">{a.governance.supported} supported / {a.governance.total} dimensions · {a.governance.assessed} assessed</Text>
        <Box h="5px" bg="#29342d" borderRadius="full" my={3}><Box h="5px" bg="#22c55e" borderRadius="full" width={a.governance.coveragePercent+'%'}/></Box>
        <Flex gap={2} wrap="wrap">
          <Button size="xs" colorScheme="green" variant="outline" onClick={()=>setActive(active===a.id?null:a.id)}>Evidence</Button>
          <Button size="xs" variant="outline" onClick={()=>setSelected(old=>old.includes(a.id)?old.filter(id=>id!==a.id):old.length<3?[...old,a.id]:old)}>{selected.includes(a.id)?'Remove compare':'Compare +'}</Button>
          {a.repository_url && <Button as="a" size="xs" href={a.repository_url} target="_blank" rel="noopener noreferrer" variant="link" color="#86efac">Source ↗</Button>}
        </Flex>
      </Box>)}
    </SimpleGrid>
    {current && <Box mt={8} p={5} bg="#101418" border="1px solid #3b654b" borderRadius="xl">
      <Heading size="md" mb={3}>Evidence — {current.name}</Heading>
      {current.evidence.length===0 && <Text color="#a1aca5">No published evidence yet. Governance remains unassessed.</Text>}
      <VStack align="stretch" spacing={3}>{current.evidence.map(e=><Box key={e.id} borderLeft="2px solid #22c55e" pl={3}>
        <Flex gap={2} align="center"><Text fontWeight="bold">{e.dimension}</Text><Badge colorScheme={e.status==='supported'?'green':e.status==='contradicted'?'red':'gray'}>{e.status}</Badge></Flex>
        <Text fontSize="sm">{e.claim}</Text><Text as="a" href={e.source_url} target="_blank" rel="noopener noreferrer" color="#86efac" fontSize="sm" textDecoration="underline">Open source ↗</Text>
      </Box>)}</VStack>
    </Box>}
    {compared.length>0 && <Box mt={8} p={5} border="1px solid #3b654b" borderRadius="xl" overflowX="auto">
      <Heading size="md" mb={3}>Governance comparison ({compared.length}/3)</Heading>
      <Box as="table" width="100%" fontSize="sm" sx={{'td,th':{padding:'9px',borderBottom:'1px solid #2b4537',textAlign:'left'}}}>
        <thead><tr><th>Dimension</th>{compared.map(a=><th key={a.id}>{a.name}</th>)}</tr></thead>
        <tbody>{dimensions.map(d=><tr key={d}><td>{d}</td>{compared.map(a=><td key={a.id}>{a.governance.dimensions[d]||'unassessed'}</td>)}</tr>)}</tbody>
      </Box>
    </Box>}
    <Text mt={8} color="#8d9b91" fontSize="xs">All displayed profiles are returned by the live directory API. Unreviewed and absent evidence never count as supported. Publication and review require administrator authorization.</Text>
  </Box>;
}
