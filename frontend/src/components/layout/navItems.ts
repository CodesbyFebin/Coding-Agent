// Shared navigation model for the desktop sidebar and mobile nav. Mirrors the
// prototype's section/grouping so both surfaces stay in sync.

export interface NavItem {
  to: string;
  label: string;
  glyph: string;
  end?: boolean;
  countKey?: 'projects' | 'missions';
}

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'COMMAND',
    items: [
      { to: '/', label: 'Command Center', glyph: '⌘', end: true },
      { to: '/projects', label: 'Projects', glyph: '◇', countKey: 'projects' },
      { to: '/missions', label: 'Missions', glyph: '≡', countKey: 'missions' },
    ],
  },
  {
    label: 'WORKSPACE',
    items: [
      { to: '/code', label: 'Code', glyph: '</>' },
      { to: '/terminal', label: 'Terminal', glyph: '>_' },
      { to: '/browser', label: 'Browser', glyph: '◎' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { to: '/memory', label: 'Memory', glyph: '▤' },
      { to: '/skills', label: 'Skills', glyph: 'ϟ' },
    ],
  },
  {
    label: 'INFRASTRUCTURE',
    items: [
      { to: '/mcp', label: 'MCP', glyph: '⚭' },
      { to: '/schedules', label: 'Schedules', glyph: '◫' },
      { to: '/security', glyph: '◇', label: 'Security' },
      { to: '/pillars', label: 'Pillars', glyph: '◈' },
      { to: '/settings', glyph: '⚙', label: 'Settings' },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

// Mobile nav surfaces the five most-used destinations, matching the
// prototype's bottom bar (Home / Projects / Run / Missions / More).
export const MOBILE_NAV_ITEMS: {
  to: string;
  label: string;
  glyph: string;
  end?: boolean;
  isPlus?: boolean;
}[] = [
  { to: '/', label: 'Home', glyph: '⌂', end: true },
  { to: '/projects', label: 'Projects', glyph: '◇' },
  { to: '/', label: 'Run', glyph: '+', isPlus: true },
  { to: '/missions', label: 'Missions', glyph: '≡' },
  { to: '/settings', label: 'More', glyph: '☰' },
];
