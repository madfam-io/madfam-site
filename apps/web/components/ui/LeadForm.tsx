'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { cn } from './utils';

export interface LeadFormData {
  name: string;
  email: string;
  company?: string;
  message?: string;
  phone?: string;
}

interface LeadFormProps {
  variant?: 'simple' | 'progressive' | 'full';
  source?: string;
  title?: string;
  description?: string;
  submitText?: string;
  className?: string;
  onSubmit?: (data: LeadFormData) => Promise<void>;
  onSuccess?: () => void;
}

export function LeadForm({
  variant = 'simple',
  source = 'website',
  title = 'Get in Touch',
  description = "Fill out the form below and we'll get back to you shortly.",
  submitText = 'Submit',
  className,
  onSubmit,
  onSuccess,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit({ ...formData });
      }
      setStatus('success');
      onSuccess?.();
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card className={cn('max-w-md mx-auto', className)}>
      <CardContent className="p-6">
        {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
        {description && <p className="text-gray-600 mb-6">{description}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="source" value={source} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {(variant === 'progressive' || variant === 'full') && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {variant === 'full' && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Thank you! We&apos;ll be in touch soon.
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              Something went wrong. Please try again.
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
