'use strict';
const express = require('express');
const { z } = require('zod');
const db = require('../config/db');
const requireAuth = require('../middleware/auth');
const { governanceSummary } = require('../services/directoryScore');
const router = express.Router();

const profileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(160),
  description: z.string().max(5000).default(''),
  category: z.enum(['agent','framework','enterprise']),
  website_url: z.string().url().startsWith('https://').nullable().optional(),
  repository_url: z.string().url().startsWith('https://').nullable().optional(),
  published: z.boolean().default(false),
});
const evidenceSchema = z.object({
  dimension: z.enum(['sandbox','audit','approvals','secrets','identity','privacy']),
  claim: z.string().trim().min(1).max(2000),
  source_url: z.string().url().startsWith('https://'),
  status: z.enum(['unreviewed','supported','contradicted']).default('unreviewed'),
});
const adminIds = () => (process.env.DIRECTORY_ADMIN_USER_IDS || '').split(',').map(x => x.trim()).filter(Boolean);
function requireAdmin(req, res, next) {
  if (!adminIds().includes(req.userId)) return res.status(403).json({ error: 'Directory administrator required' });
  return next();
}
router.get('/agents', async (req, res, next) => {
  try {
    const agents = await db('directory_agents').where({ published: true }).orderBy('name').limit(500);
    const evidence = agents.length ? await db('directory_evidence').whereIn('agent_id', agents.map(a => a.id)).orderBy('created_at','desc') : [];
    res.json({ agents: agents.map(agent => {
      const sources = evidence.filter(e => e.agent_id === agent.id);
      return { ...agent, governance: governanceSummary(sources), evidence: sources.map(({id,dimension,claim,source_url,status,reviewed_at}) => ({id,dimension,claim,source_url,status,reviewed_at})) };
    }), total: agents.length });
  } catch (err) { next(err); }
});
router.get('/agents/:slug', async (req, res, next) => {
  try {
    const agent = await db('directory_agents').where({ slug: req.params.slug, published: true }).first();
    if (!agent) return res.status(404).json({error:'Agent not found'});
    const evidence = await db('directory_evidence').where({agent_id:agent.id}).orderBy('created_at','desc');
    res.json({...agent, governance: governanceSummary(evidence), evidence});
  } catch (err) { next(err); }
});
router.post('/agents', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:parsed.error.flatten()});
    const [agent] = await db('directory_agents').insert(parsed.data).returning('*');
    res.status(201).json(agent);
  } catch (err) { next(err); }
});
router.patch('/agents/:slug', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const parsed = profileSchema.partial().safeParse(req.body);
    if (!parsed.success || Object.keys(parsed.data || {}).length === 0) return res.status(400).json({error:'Valid update fields required'});
    const [agent] = await db('directory_agents').where({slug:req.params.slug}).update({...parsed.data,updated_at:new Date()}).returning('*');
    if (!agent) return res.status(404).json({error:'Agent not found'});
    res.json(agent);
  } catch (err) { next(err); }
});
router.post('/agents/:slug/evidence', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const parsed = evidenceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:parsed.error.flatten()});
    const agent = await db('directory_agents').where({slug:req.params.slug}).first();
    if (!agent) return res.status(404).json({error:'Agent not found'});
    const reviewed = parsed.data.status !== 'unreviewed';
    const [evidence] = await db('directory_evidence').insert({
      agent_id:agent.id, ...parsed.data, reviewed_by: reviewed ? req.userId : null, reviewed_at:reviewed ? new Date() : null
    }).returning('*');
    res.status(201).json(evidence);
  } catch (err) { next(err); }
});
module.exports = router;
