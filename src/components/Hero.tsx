import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Elegant Geometric Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Subtle Gradient Accent Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                <div className="animate-fade-in-up">
                    {/* Badge */}
                    <div className="inline-flex items-center px-5 py-2.5 mb-8 bg-white/10 backdrop-blur-md rounded-full border border-teal-400/30">
                        <span className="text-sm font-semibold text-teal-300">
                            ✨ The Modern Way to Shorten URLs
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Shorten Links,
                        <br />
                        <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                            Amplify Results
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Transform long, complex URLs into short, memorable links. Track clicks,
                        analyze performance, and share with confidence.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
                        >
                            Get Started Free
                        </Link>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-10 py-4 rounded-xl text-lg hover:bg-white/20 transition-all duration-300">
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent mb-2">10+</div>
                            <div className="text-slate-300 font-medium">Links Created</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">50+</div>
                            <div className="text-slate-300 font-medium">Clicks Tracked</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2">99.9%</div>
                            <div className="text-slate-300 font-medium">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave - Elegant Navy */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        fill="white"
                        fillOpacity="0.05"
                    />
                </svg>
            </div>
        </section>
    );
}
