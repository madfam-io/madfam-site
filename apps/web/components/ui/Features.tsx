import { cn } from './utils';
import { Container } from './Container';
import { Card, CardContent } from './Card';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'cards' | 'simple' | 'centered' | 'grid';
  className?: string;
  centered?: boolean;
  iconStyle?: 'default' | 'gradient' | 'solid';
}

export function Features({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = 'cards',
  className,
  centered = false,
  iconStyle = 'default',
}: FeaturesProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const iconStyles = {
    default: 'bg-blue-100 text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
    solid: 'bg-blue-600 text-white',
  };

  const isGridOrCentered = variant === 'grid' || variant === 'centered' || centered;

  return (
    <section className={cn('py-16', className)}>
      <Container>
        {(title || subtitle || description) && (
          <div className={cn('mb-12', centered && 'text-center')}>
            {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">{subtitle}</p>}
            {description && <p className="text-gray-500 max-w-3xl mx-auto">{description}</p>}
          </div>
        )}
        <div className={cn('grid gap-8', gridCols[columns])}>
          {features.map((feature, index) =>
            variant === 'cards' ? (
              <Card key={index}>
                <CardContent className="p-6">
                  {feature.icon && (
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                        iconStyles[iconStyle]
                      )}
                    >
                      {feature.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ) : (
              <div key={index} className={cn(isGridOrCentered && 'text-center')}>
                {feature.icon && (
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                      iconStyles[iconStyle],
                      isGridOrCentered && 'mx-auto'
                    )}
                  >
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          )}
        </div>
      </Container>
    </section>
  );
}
