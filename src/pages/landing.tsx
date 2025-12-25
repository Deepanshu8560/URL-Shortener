import Head from 'next/head';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';

export default function LandingPage() {
    return (
        <>
            <Head>
                <title>URL Shortener - Shorten Links, Amplify Results</title>
                <meta name="description" content="Transform long URLs into short, memorable links. Track clicks, analyze performance, and share with confidence. Fast, secure, and reliable." />
                <meta name="keywords" content="URL shortener, link shortener, short links, link tracking, analytics" />
                <meta property="og:title" content="URL Shortener - Shorten Links, Amplify Results" />
                <meta property="og:description" content="Transform long URLs into short, memorable links. Track clicks and analyze performance." />
                <meta property="og:type" content="website" />
            </Head>

            <div className="min-h-screen">
                <Hero />
                <Features />
                <Stats />
                <CTA />
            </div>
        </>
    );
}
