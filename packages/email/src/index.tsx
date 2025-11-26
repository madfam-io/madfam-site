import { render } from '@react-email/render';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { AssessmentResultsEmail } from './templates/AssessmentResultsEmail';
import { ROIResultsEmail } from './templates/ROIResultsEmail';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WelcomeEmailData {
  name: string;
  language: 'es-MX' | 'en-US';
  tier: string;
}

export interface AssessmentResultsEmailData {
  assessmentId: string;
  score: number;
  tier: string;
  strengths: string[];
  recommendations: string[];
  language?: 'es-MX' | 'en-US';
}

export interface ROIResultsEmailData {
  calculationId: string;
  results: {
    roi: {
      percentage: number;
      paybackMonths: number;
      fiveYearNetSavings: number;
    };
    futureState: {
      annualSavings: number;
    };
    benefits: {
      productivityGain: string;
      hoursRecoveredMonthly: number;
      costReduction: string;
    };
  };
  language?: 'es-MX' | 'en-US';
}

export class EmailService {
  private getSubject(template: string, data: any): string {
    const subjects = {
      'es-MX': {
        welcome: 'Bienvenido a MADFAM - Tu socio en transformación digital',
        'assessment-results': 'Resultados de tu evaluación de preparación para IA',
        'roi-results': 'Resultados de tu análisis de ROI',
        'project-estimate-results': 'Estimación de tu proyecto - MADFAM',
      },
      'en-US': {
        welcome: 'Welcome to MADFAM - Your digital transformation partner',
        'assessment-results': 'Your AI Readiness Assessment Results',
        'roi-results': 'Your ROI Analysis Results',
        'project-estimate-results': 'Your Project Estimate - MADFAM',
      },
    };

    const language: 'es-MX' | 'en-US' = data.language || 'es-MX';
    const subjectMap = subjects[language];
    return subjectMap[template as keyof typeof subjectMap] || 'MADFAM Notification';
  }

  async renderWelcomeEmail(data: WelcomeEmailData): Promise<EmailTemplate> {
    const html = await render(<WelcomeEmail {...data} />);
    const text = this.htmlToText(html);
    const subject = this.getSubject('welcome', data);

    return { subject, html, text };
  }

  async renderAssessmentResultsEmail(data: AssessmentResultsEmailData): Promise<EmailTemplate> {
    const html = await render(<AssessmentResultsEmail {...data} />);
    const text = this.htmlToText(html);
    const subject = this.getSubject('assessment-results', data);

    return { subject, html, text };
  }

  async renderROIResultsEmail(data: ROIResultsEmailData): Promise<EmailTemplate> {
    const html = await render(<ROIResultsEmail {...data} />);
    const text = this.htmlToText(html);
    const subject = this.getSubject('roi-results', data);

    return { subject, html, text };
  }

  async renderProjectEstimateEmail(data: any): Promise<EmailTemplate> {
    // For now, use a simple template
    const html = `
      <h1>Project Estimate Results</h1>
      <p>Thank you for using our project estimator.</p>
      <p>Total estimate: ${data.results.pricing.total} ${data.results.pricing.currency}</p>
      <p>Timeline: ${data.results.timeline.minWeeks}-${data.results.timeline.maxWeeks} weeks</p>
      <p>We'll contact you soon to discuss your project in detail.</p>
    `;
    const text = this.htmlToText(html);
    const subject = this.getSubject('project-estimate-results', data);

    return { subject, html, text };
  }

  async renderTemplate(template: string, data: any): Promise<EmailTemplate> {
    switch (template) {
      case 'welcome':
        return this.renderWelcomeEmail(data);
      case 'assessment-results':
        return this.renderAssessmentResultsEmail(data);
      case 'roi-results':
        return this.renderROIResultsEmail(data);
      case 'project-estimate-results':
        return this.renderProjectEstimateEmail(data);
      default:
        throw new Error(`Unknown email template: ${template}`);
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
}

// Export template components
export { WelcomeEmail, AssessmentResultsEmail, ROIResultsEmail };

// Export service instance
export const emailService = new EmailService();

// Export Janua email sender for centralized email delivery
export {
  JanuaEmailSender,
  januaEmailSender,
  sendEmailViaJanua,
  sendTemplateEmailViaJanua,
  checkJanuaHealth,
  JANUA_TEMPLATES,
} from './janua-sender';
