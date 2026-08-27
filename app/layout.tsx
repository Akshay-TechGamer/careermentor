import type { Metadata } from 'next';
import { Manrope, Work_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['600', '700', '800'] });
const workSans = Work_Sans({ variable: '--font-work-sans', subsets: ['latin'], weight: ['400', '500', '600'] });
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], weight: ['500'] });

export const metadata: Metadata = {
	title: 'CareerMentor — Build a Winning Resume',
	description:
		'Free professional resume templates and instant AI-style analysis to get you hired faster. Build, analyze, and export an ATS-ready resume.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang="en"
			className={`${manrope.variable} ${workSans.variable} ${jetbrains.variable} h-full`}
		>
			<body className="min-h-full flex flex-col bg-surface text-on-surface">
				<Header />
				<main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
				<Footer />
				<BottomNav />
			</body>
		</html>
	);
}
