import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { HandleRoleException } from '../role-exception';

interface AppLayoutProps {
    children: React.ReactNode;
}
export const metadata: Metadata = {
    title: 'HCMUT Smart Printing Service',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'PrimeReact HCMUT-REACT',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        ttl: 604800
    },
    icons: {
        icon: `/layout/images/hcmut.png`
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout><HandleRoleException type='spso'>{children}</HandleRoleException></Layout>;
}