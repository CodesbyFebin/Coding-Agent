import { http, HttpResponse, delay } from 'msw';
import { STORAGE_KEYS } from '../lib/constants';
import type {
  AuthResponse,
  Mission,
  MissionDetail,
  MissionMode,
  MissionStatus,
  Workspace,
} from '../types';

// In-memory mock state. MSW is dev-only (see main.tsx guard) and never runs
// in production builds, so this fixture data never ships to the deployed app.
const now = () => new Date().toISOString();

const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Core Platform Modernization',
    description: 'Agentic engineering workspace for the React Command Center.',
    role: 'owner',
    status: 'active',
    createdAt: now(),
  },
  {
    id: 'ws-2',
    name: 'SEO & Content Engine',
    description: 'Neon DB and SEO infrastructure tasks.',
    role: 'admin',
    status: 'active',
    createdAt: now(),
  },
];

const mockMissions: Mission[] = [
  {
    id: 'm-1',
    workspaceId: 'ws-1',
    goal: 'Verify React 18 build pipeline produces a deployable bundle',
    mode: 'INSTANT',
    status: 'COMPLETED',
    resultText: 'Vite build succeeded. dist/ contains index.html and assets.',
    errorMessage: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'm-2',
    workspaceId: 'ws-1',
    goal: 'Execute live integration test against the new router',
    mode: 'AGENT',
    status: 'RUNNING',
    resultText: null,
    errorMessage: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'm-3',
    workspaceId: 'ws-2',
    goal: 'Generate sitemap.xml and submit to search console',
    mode: 'INSTANT',
    status: 'PENDING',
    resultText: null,
    errorMessage: null,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const handlers = [
  // -- Auth --
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { email: string; password: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    const res: AuthResponse = {
      token: `mock-jwt-${Date.now()}`,
      user: { id: '1', email: body.email, username: body.email.split('@')[0] },
    };
    return HttpResponse.json(res);
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string };
    if (!body.email || body.password.length < 8) {
      return HttpResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    const res: AuthResponse = {
      token: `mock-jwt-${Date.now()}`,
      user: { id: '2', email: body.email, username: body.email.split('@')[0] },
    };
    return HttpResponse.json(res);
  }),

  // -- Workspaces --
  http.get('/api/v1/workspaces', async ({ request }) => {
    await delay(300);
    const token = request.headers.get('Authorization');
    if (!token) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({ workspaces: mockWorkspaces });
  }),

  http.post('/api/v1/workspaces', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { name: string; description?: string };
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: body.name || 'Untitled Workspace',
      description: body.description ?? '',
      role: 'owner',
      status: 'active',
      createdAt: now(),
    };
    mockWorkspaces.push(newWs);
    return HttpResponse.json({ workspace: newWs }, { status: 201 });
  }),

  // -- Missions --
  http.get('/api/v1/workspaces/:workspaceId/missions', async ({ params }) => {
    await delay(250);
    const { workspaceId } = params;
    const missions = mockMissions.filter((m) => m.workspaceId === workspaceId);
    return HttpResponse.json({ missions });
  }),

  http.get(
    '/api/v1/workspaces/:workspaceId/missions/:missionId',
    async ({ params }) => {
      await delay(300);
      const mission = mockMissions.find((m) => m.id === params.missionId);
      if (!mission) {
        return HttpResponse.json({ message: 'Mission not found' }, { status: 404 });
      }
      const detail: MissionDetail = {
        ...mission,
        evidence: [],
        modelInvocations: [],
      };
      return HttpResponse.json(detail);
    }
  ),

  http.post(
    '/api/v1/workspaces/:workspaceId/missions',
    async ({ params, request }) => {
      await delay(400);
      const body = (await request.json()) as {
        goal: string;
        mode: MissionMode;
      };
      const newMission: Mission = {
        id: `m-${Date.now()}`,
        workspaceId: params.workspaceId as string,
        goal: body.goal,
        mode: body.mode || 'INSTANT',
        status: 'PENDING',
        resultText: null,
        errorMessage: null,
        createdAt: now(),
        updatedAt: now(),
      };
      mockMissions.push(newMission);
      return HttpResponse.json({ mission: newMission }, { status: 201 });
    }
  ),

  http.post(
    '/api/v1/workspaces/:workspaceId/missions/:missionId/run',
    async ({ params }) => {
      await delay(300);
      const mission = mockMissions.find((m) => m.id === params.missionId);
      if (!mission) {
        return HttpResponse.json({ message: 'Mission not found' }, { status: 404 });
      }
      if (mission.mode !== 'INSTANT') {
        return HttpResponse.json(
          { message: `Mode ${mission.mode} not implemented (501)` },
          { status: 501 }
        );
      }
      mission.status = 'RUNNING' as MissionStatus;
      return HttpResponse.json({ mission });
    }
  ),

  // -- SSE event stream (mock) --
  http.get('/api/v1/events/stream', ({ request }) => {
    const token = new URL(request.url).searchParams.get('token');
    const authHeader = request.headers.get('Authorization');
    if (!token && !authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        let step = 0;
        const interval = setInterval(() => {
          step += 1;
          const progress = Math.min(step * 25, 100);
          const isComplete = progress === 100;
          const event = {
            id: `evt-${Date.now()}`,
            type: isComplete ? 'MISSION_COMPLETED' : 'MISSION_PROGRESS',
            timestamp: now(),
            payload: {
              missionId: 'm-2',
              progress,
              status: isComplete ? 'COMPLETED' : 'RUNNING',
              message: isComplete
                ? 'Mission executed successfully.'
                : `Executing step ${step}/4...`,
            },
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          if (isComplete) {
            clearInterval(interval);
            controller.close();
          }
        }, 1500);
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
];

// Side-effect-free export to satisfy the STORAGE_KEYS import (keeps tree-shaking
// honest in case future handlers prefer the namespaced key).
void STORAGE_KEYS;
