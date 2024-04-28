import type { Metadata } from 'next';

import Layout from '@/layout/layout';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
  description:
    'Найзручніший сервіс для взаємодії людей з волонтерами.',
  robots: { index: false, follow: false },
  viewport: { initialScale: 1, width: 'device-width' },
  openGraph: {
    type: 'website',
    title: `${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
    url: `${process.env.FRONTEND_URL}`,
    description:
      'Найзручніший сервіс для взаємодії людей з волонтерами.',
    images: ['https://www.primefaces.org/static/social/sakai-react.png'],
    ttl: 604800
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <Layout>{children}</Layout>;
}
