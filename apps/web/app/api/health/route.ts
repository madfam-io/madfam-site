import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface ServiceHealth {
  status: 'ok' | 'degraded' | 'error';
  responseTime?: number;
  lastChecked: string;
  error?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    janua: ServiceHealth;
    forgesight: ServiceHealth;
    cotiza: ServiceHealth;
  };
}

async function checkServiceHealth(name: string, url: string | undefined): Promise<ServiceHealth> {
  if (!url) {
    return {
      status: 'ok',
      lastChecked: new Date().toISOString(),
    };
  }

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${url}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;

    return {
      status: response.ok ? 'ok' : 'degraded',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function GET() {
  const startTime = Date.now();

  // Check ecosystem services in parallel
  const [januaHealth, forgesightHealth, cotizaHealth] = await Promise.all([
    checkServiceHealth('janua', process.env.JANUA_API_URL),
    checkServiceHealth('forgesight', process.env.FORGESIGHT_API_URL),
    checkServiceHealth('cotiza', process.env.COTIZA_API_URL),
  ]);

  const services = {
    janua: januaHealth,
    forgesight: forgesightHealth,
    cotiza: cotizaHealth,
  };

  // Determine overall status
  const serviceStatuses = Object.values(services).map(s => s.status);
  let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';

  if (serviceStatuses.some(s => s === 'error')) {
    overallStatus = 'degraded';
  }
  if (serviceStatuses.every(s => s === 'error')) {
    overallStatus = 'error';
  }

  const healthResponse: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    uptime: Date.now() - startTime,
    services,
  };

  const statusCode = overallStatus === 'error' ? 503 : 200;

  return NextResponse.json(healthResponse, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
