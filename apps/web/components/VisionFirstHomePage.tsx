'use client';

import { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Button, Container, Heading } from '@/components/ui';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatedText } from '@/components/AnimatedText';
import { Badge } from '@/components/corporate/Badge';
import { ClientLogos } from '@/components/corporate/ClientLogos';

// Vision pillars - the core of MADFAM's mission
const visionPillars = [
  {
    icon: '🌱',
    title: 'Regenerative Technology',
    description: 'Building systems that give back more than they take',
    color: 'green',
  },
  {
    icon: '🤝',
    title: 'Human-AI Synergy',
    description: 'Where creativity meets artificial intelligence',
    color: 'purple',
  },
  {
    icon: '🌍',
    title: 'LATAM-First Innovation',
    description: 'Solutions designed for Latin America, built for the world',
    color: 'yellow',
  },
];

// Impact metrics
const impactMetrics = [
  { value: '50+', label: 'Enterprise Partners', suffix: '' },
  { value: '12', label: 'Countries Served', suffix: '' },
  { value: '2M+', label: 'Lives Impacted', suffix: '' },
  { value: '98', label: 'Client Satisfaction', suffix: '%' },
];

// Business units / Arms
const businessArms = [
  {
    name: 'Aureo Labs',
    tagline: 'Digital Innovation Lab',
    description: 'AI-powered products for financial wellness and manufacturing intelligence',
    icon: '💡',
    color: 'amber',
    products: ['Dhanam', 'Forge Sight', 'Cotiza'],
    href: 'https://aureolabs.dev',
  },
  {
    name: 'Primavera3D',
    tagline: 'Design & Fabrication Studio',
    description: 'Digital fabrication and parametric design for the physical world',
    icon: '🎨',
    color: 'green',
    products: ['3D Design', 'Parametric Modeling', 'Fabrication'],
    href: '/solutions/primavera3d',
  },
  {
    name: 'MADFAM Co-Labs',
    tagline: 'Innovation Programs',
    description: 'Educational programs and innovation labs for enterprises',
    icon: '🚀',
    color: 'purple',
    products: ['Workshops', 'Bootcamps', 'Consulting'],
    href: '/programs',
  },
];

export function VisionFirstHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState(0);

  // Scroll-based section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Vision Statement */}
      <section
        data-section="hero"
        className="relative min-h-screen flex items-center justify-center bg-neutral-900 overflow-hidden"
      >
        {/* Animated background - Solarpunk aesthetic */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2c8136] rounded-full filter blur-[128px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#58326f] rounded-full filter blur-[128px] opacity-20 animate-pulse animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#eebc15] rounded-full filter blur-[96px] opacity-10 animate-pulse animation-delay-2000" />

          {/* Geometric pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Container className="relative z-10 text-center">
          <AnimatedText variant="fadeUp" className="mb-8">
            <Badge
              variant="by-madfam"
              className="text-white/80 bg-white/10 border-white/20 backdrop-blur-sm mb-6"
            >
              Where AI Meets Human Creativity
            </Badge>

            <Heading
              level={1}
              className="text-white mb-6 text-5xl md:text-7xl font-bold tracking-tight"
            >
              <span className="block">Building</span>
              <span className="block bg-gradient-to-r from-[#2c8136] via-[#58326f] to-[#eebc15] bg-clip-text text-transparent">
                Regenerative Futures
              </span>
            </Heading>

            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
              We create AI-powered tools and experiences that amplify human potential while
              respecting our planet. Technology should give back more than it takes.
            </p>
          </AnimatedText>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={`/${locale}/about`}>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-neutral-900 hover:bg-neutral-100"
              >
                Our Story
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={`/${locale}/solutions`}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Explore Solutions
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ArrowDownIcon className="w-6 h-6 text-white/50 mx-auto" />
          </div>
        </Container>
      </section>

      {/* Vision Pillars Section */}
      <section data-section="vision" className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="by-madfam" className="mb-4">
              Our Vision
            </Badge>
            <Heading level={2} className="text-neutral-900 mb-4">
              Technology for a Thriving World
            </Heading>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Every solution we build is guided by three interconnected principles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {visionPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className={`p-8 rounded-2xl border-2 transition-all duration-500 hover:shadow-xl ${
                  pillar.color === 'green'
                    ? 'border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50/50 to-white'
                    : pillar.color === 'purple'
                      ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50/50 to-white'
                      : 'border-amber-200 hover:border-amber-400 bg-gradient-to-br from-amber-50/50 to-white'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-6">{pillar.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{pillar.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Section */}
      <section data-section="impact" className="py-24 bg-neutral-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2c8136] via-transparent to-[#58326f]" />
        </div>

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Badge variant="by-madfam" className="mb-4 text-white/80 bg-white/10 border-white/20">
              Our Impact
            </Badge>
            <Heading level={2} className="text-white mb-4">
              Making a Difference Across LATAM
            </Heading>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Real numbers, real impact. Here's what we've achieved together with our partners.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {impactMetrics.map(metric => (
              <div key={metric.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {metric.value}
                  <span className="text-[#eebc15]">{metric.suffix}</span>
                </div>
                <div className="text-white/60 text-sm uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Business Arms Section */}
      <section data-section="arms" className="py-24 bg-neutral-50">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="by-madfam" className="mb-4">
              The MADFAM Family
            </Badge>
            <Heading level={2} className="text-neutral-900 mb-4">
              Specialized Units, Unified Vision
            </Heading>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Each arm of MADFAM brings unique expertise to solve different challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {businessArms.map(arm => (
              <Link
                key={arm.name}
                href={arm.href}
                target={arm.href.startsWith('http') ? '_blank' : undefined}
                className={`group p-8 rounded-2xl bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                  arm.color === 'amber'
                    ? 'border-amber-200 hover:border-amber-400'
                    : arm.color === 'green'
                      ? 'border-green-200 hover:border-green-400'
                      : 'border-purple-200 hover:border-purple-400'
                }`}
              >
                <div className="text-4xl mb-4">{arm.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">{arm.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{arm.tagline}</p>
                <p className="text-neutral-600 mb-6 leading-relaxed">{arm.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {arm.products.map(product => (
                    <span
                      key={product}
                      className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-full"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                <div
                  className={`flex items-center font-semibold group-hover:translate-x-2 transition-transform ${
                    arm.color === 'amber'
                      ? 'text-amber-600'
                      : arm.color === 'green'
                        ? 'text-green-600'
                        : 'text-purple-600'
                  }`}
                >
                  Explore {arm.name}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Products Showcase */}
      <section data-section="products" className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="by-madfam" className="mb-4">
              Featured Products
            </Badge>
            <Heading level={2} className="text-neutral-900 mb-4">
              Tools That Make a Difference
            </Heading>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover our flagship products designed to solve real problems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dhanam */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">💰</span>
                <h3 className="text-2xl font-bold mb-2">Dhanam</h3>
                <p className="text-blue-100 mb-4">Financial Wellness Platform</p>
                <p className="text-white/80 mb-6">
                  AI-powered financial wellness for individuals and enterprises. Reduce financial
                  stress, increase employee retention.
                </p>
                <Link href={`/${locale}/demo/dhanam`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Try Demo
                    <PlayIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Forge Sight */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-green-800 p-8 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">🏭</span>
                <h3 className="text-2xl font-bold mb-2">Forge Sight</h3>
                <p className="text-green-100 mb-4">Manufacturing Intelligence</p>
                <p className="text-white/80 mb-6">
                  Pricing intelligence for digital fabrication and 3D printing. Get accurate quotes
                  in seconds, not hours.
                </p>
                <Link href={`/${locale}/demo/forge-sight`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-green-600 hover:bg-green-50"
                  >
                    Try Demo
                    <PlayIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/solutions/compare`}>
              <Button variant="outline" size="lg">
                Compare All Products
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Client Logos */}
      <ClientLogos variant="with-metrics" showPlaceholders={true} />

      {/* CTA Section */}
      <section
        data-section="cta"
        className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#2c8136] rounded-full filter blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#58326f] rounded-full filter blur-[100px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} className="text-white mb-6">
              Ready to Build Something Meaningful?
            </Heading>
            <p className="text-xl text-white/80 mb-12">
              Whether you're looking to transform your organization or explore what's possible, we'd
              love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/assessment`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-gradient-to-r from-[#2c8136] to-[#58326f] text-white border-0 hover:opacity-90"
                >
                  Take AI Assessment
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
