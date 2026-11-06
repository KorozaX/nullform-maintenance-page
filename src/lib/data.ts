export type ServiceState = 'operational' | 'degraded' | 'maintenance';
export type GlyphKind = 'gateway' | 'identity' | 'database' | 'display' | 'edge' | 'queue';

export interface ServiceMetric {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  index: string;
  name: string;
  shortName: string;
  description: string;
  state: ServiceState;
  stateLabel: string;
  glyph: GlyphKind;
  region: string;
  note: string;
  metrics: ServiceMetric[];
  signal: number[];
}

export const SERVICES: Service[] = [
  {
    id: 'api-gateway',
    index: '01',
    name: 'API Gateway',
    shortName: 'GATEWAY',
    description: 'Public request routing and rate limiting.',
    state: 'degraded',
    stateLabel: 'Degraded',
    glyph: 'gateway',
    region: 'GLOBAL / 12 NODES',
    note: 'Requests are being served in read-only mode while routing rules are re-indexed.',
    metrics: [
      { label: 'LATENCY', value: '42 MS' },
      { label: 'SUCCESS', value: '99.2%' },
      { label: 'THROUGHPUT', value: '1.8K/S' },
    ],
    signal: [38, 52, 44, 68, 55, 73, 62, 48, 58, 34, 45, 40],
  },
  {
    id: 'authentication',
    index: '02',
    name: 'Authentication',
    shortName: 'IDENTITY',
    description: 'Sessions, tokens, and access control.',
    state: 'operational',
    stateLabel: 'Operational',
    glyph: 'identity',
    region: 'EU-WEST / PRIMARY',
    note: 'Identity verification is available. Existing sessions remain active across all regions.',
    metrics: [
      { label: 'LATENCY', value: '18 MS' },
      { label: 'SUCCESS', value: '99.99%' },
      { label: 'SESSIONS', value: '24.6K' },
    ],
    signal: [49, 48, 50, 47, 51, 48, 50, 49, 48, 50, 49, 51],
  },
  {
    id: 'database',
    index: '03',
    name: 'Database Cluster',
    shortName: 'DATA',
    description: 'Primary storage and replication layer.',
    state: 'maintenance',
    stateLabel: 'Maintenance',
    glyph: 'database',
    region: 'US-EAST / REPLICA 03',
    note: 'A scheduled index rebuild is in progress. Writes are queued and will replay automatically.',
    metrics: [
      { label: 'LATENCY', value: '11 MS' },
      { label: 'REPLAY QUEUE', value: '6.4K' },
      { label: 'INTEGRITY', value: '100%' },
    ],
    signal: [30, 28, 35, 24, 18, 20, 16, 22, 18, 12, 16, 10],
  },
  {
    id: 'website',
    index: '04',
    name: 'Main Website',
    shortName: 'SURFACE',
    description: 'Web application and account surfaces.',
    state: 'maintenance',
    stateLabel: 'Maintenance',
    glyph: 'display',
    region: 'GLOBAL / EDGE',
    note: 'A front-end release is being deployed behind a maintenance boundary. This portal remains available.',
    metrics: [
      { label: 'DEPLOY', value: '72%' },
      { label: 'BUILD', value: 'R-4471' },
      { label: 'BOUNDARY', value: 'ACTIVE' },
    ],
    signal: [15, 18, 20, 22, 24, 30, 36, 44, 48, 56, 60, 64],
  },
  {
    id: 'edge',
    index: '05',
    name: 'CDN / Edge Network',
    shortName: 'EDGE',
    description: 'Static delivery and edge compute.',
    state: 'operational',
    stateLabel: 'Operational',
    glyph: 'edge',
    region: 'GLOBAL / 248 POPS',
    note: 'Edge caches have been purged and repopulated. Static assets are serving from all regions.',
    metrics: [
      { label: 'LATENCY', value: '9 MS' },
      { label: 'HIT RATE', value: '97.4%' },
      { label: 'REGIONS', value: '32 / 32' },
    ],
    signal: [46, 52, 50, 55, 52, 57, 54, 60, 58, 61, 59, 62],
  },
  {
    id: 'background',
    index: '06',
    name: 'Background Processing',
    shortName: 'WORKERS',
    description: 'Asynchronous jobs and event streams.',
    state: 'degraded',
    stateLabel: 'Degraded',
    glyph: 'queue',
    region: 'EU-CENTRAL / POOL 02',
    note: 'The event queue is draining in controlled batches. No jobs have been dropped.',
    metrics: [
      { label: 'QUEUE', value: '1.2K' },
      { label: 'LATENCY', value: '184 MS' },
      { label: 'RETRIES', value: '0.02%' },
    ],
    signal: [70, 66, 62, 58, 61, 55, 49, 52, 44, 39, 42, 34],
  },
];

export const STATUS_ORDER: ServiceState[] = ['operational', 'degraded', 'maintenance'];

export interface TimelineStage {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  meta: string;
  log: string;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 'initiated',
    index: '01',
    title: 'Maintenance initiated',
    shortTitle: 'INIT',
    description: 'Change window opened and traffic drained.',
    detail:
      'The change window was opened by the platform reliability team. Write operations were paused and a global announcement was issued to connected clients.',
    meta: 'WINDOW OPEN',
    log: 'protocol / NF-MNT-8841 / operator / SYS-04',
  },
  {
    id: 'updates',
    index: '02',
    title: 'Infrastructure updates',
    shortTitle: 'UPDATE',
    description: 'Core patches and infrastructure upgrades.',
    detail:
      'Database indexes were rebuilt, edge caches purged, and the primary application release was staged across all twelve routing zones.',
    meta: 'CHANGES APPLIED',
    log: 'release / R-4471 / build / 8841.06',
  },
  {
    id: 'verification',
    index: '03',
    title: 'System verification',
    shortTitle: 'VERIFY',
    description: 'Integrity, security, and performance checks.',
    detail:
      'Automated end-to-end checks are running across the platform. Each zone must pass integrity, authentication, and latency gates before traffic can return.',
    meta: 'IN PROGRESS',
    log: 'checks / 6 zones / 4 complete',
  },
  {
    id: 'restored',
    index: '04',
    title: 'Services restored',
    shortTitle: 'RESTORE',
    description: 'Progressive traffic restoration begins.',
    detail:
      'Traffic will return gradually across regions, starting with edge delivery and identity services. We will continue monitoring for two hours after restoration.',
    meta: 'EXPECTED',
    log: 'traffic / staged / monitor / 120 min',
  },
];

export const TICKER_ITEMS = [
  'SCHEDULED MAINTENANCE WINDOW 04',
  'EDGE CACHE PURGED',
  'DATABASE INDEX REBUILD IN PROGRESS',
  '4 OF 6 SERVICES RESPONDING',
  'ZERO DATA LOSS DETECTED',
  'RELEASE R-4471 STAGED',
  'SYSTEM VERIFICATION ACTIVE',
];
