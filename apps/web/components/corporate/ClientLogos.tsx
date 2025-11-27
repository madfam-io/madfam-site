'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/ui';

// Client logo data - replace placeholder paths with actual logos when available
const clients = [
  {
    name: 'Enterprise Client 1',
    logo: '/assets/clients/placeholder-1.svg',
    industry: 'Manufacturing',
  },
  {
    name: 'Enterprise Client 2',
    logo: '/assets/clients/placeholder-2.svg',
    industry: 'Finance',
  },
  {
    name: 'Enterprise Client 3',
    logo: '/assets/clients/placeholder-3.svg',
    industry: 'Healthcare',
  },
  {
    name: 'Enterprise Client 4',
    logo: '/assets/clients/placeholder-4.svg',
    industry: 'Technology',
  },
  {
    name: 'Enterprise Client 5',
    logo: '/assets/clients/placeholder-5.svg',
    industry: 'Retail',
  },
];

// Metrics to display
const metrics = [
  { value: '50+', label: 'Enterprise Clients' },
  { value: '12', label: 'Countries' },
  { value: '$2M+', label: 'Client Savings' },
  { value: '98%', label: 'Satisfaction' },
];

interface ClientLogosProps {
  variant?: 'default' | 'compact' | 'with-metrics';
  showPlaceholders?: boolean;
}

export function ClientLogos({ variant = 'default', showPlaceholders = true }: ClientLogosProps) {
  const t = useTranslations('corporate');

  if (variant === 'compact') {
    return (
      <section className="py-8 bg-neutral-50 border-y border-neutral-200">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <p className="text-sm text-neutral-500 font-medium">
              {t('trustedBy.label', { defaultValue: 'Trusted by leading LATAM enterprises' })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {clients.slice(0, 4).map((client, index) => (
                <ClientLogoItem
                  key={client.name}
                  client={client}
                  showPlaceholder={showPlaceholders}
                  index={index}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (variant === 'with-metrics') {
    return (
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {t('trustedBy.title', { defaultValue: 'Trusted by Industry Leaders' })}
            </h2>
            <p className="text-neutral-600">
              {t('trustedBy.subtitle', {
                defaultValue: 'Building regenerative futures across Latin America',
              })}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {metrics.map(metric => (
              <div key={metric.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-neutral-600">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Client Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {clients.map((client, index) => (
              <ClientLogoItem
                key={client.name}
                client={client}
                showPlaceholder={showPlaceholders}
                index={index}
                size="large"
              />
            ))}
          </div>

          {showPlaceholders && (
            <p className="text-center text-xs text-neutral-400 mt-8">
              Logo placeholders - Replace with actual client logos when available
            </p>
          )}
        </Container>
      </section>
    );
  }

  // Default variant
  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-200">
      <Container>
        <p className="text-center text-sm text-neutral-600 mb-8 font-medium">
          {t('trustedBy.label', {
            defaultValue: 'Trusted by 50+ LATAM enterprises building regenerative futures',
          })}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <ClientLogoItem
              key={client.name}
              client={client}
              showPlaceholder={showPlaceholders}
              index={index}
            />
          ))}
        </div>
        {showPlaceholders && (
          <p className="text-center text-xs text-neutral-500 mt-6">
            Logo placeholders - Replace with actual client logos
          </p>
        )}
      </Container>
    </section>
  );
}

interface ClientLogoItemProps {
  client: (typeof clients)[0];
  showPlaceholder: boolean;
  index: number;
  size?: 'default' | 'large';
}

function ClientLogoItem({ client, showPlaceholder, index, size = 'default' }: ClientLogoItemProps) {
  const dimensions = size === 'large' ? { width: 140, height: 70 } : { width: 120, height: 60 };

  if (showPlaceholder) {
    return (
      <div
        className={`${
          size === 'large' ? 'h-24' : 'h-20'
        } bg-neutral-200/50 rounded-lg flex items-center justify-center border border-neutral-300/50 grayscale opacity-60 hover:opacity-80 transition-opacity`}
      >
        <div className="text-center">
          <span className="text-neutral-400 font-medium text-sm">Client {index + 1}</span>
          <span className="block text-neutral-400 text-xs">{client.industry}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
      <Image
        src={client.logo}
        alt={`${client.name} logo`}
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
      />
    </div>
  );
}

// Export for creating client logo placeholder SVGs
export function generatePlaceholderLogos() {
  // This would be used to generate placeholder SVG files
  // In production, replace with actual client logos
  return clients.map((client, index) => ({
    filename: `placeholder-${index + 1}.svg`,
    content: `<svg width="120" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="60" fill="#f5f5f5" rx="8"/>
      <text x="60" y="30" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-family="system-ui" font-size="12">
        ${client.name}
      </text>
    </svg>`,
  }));
}
