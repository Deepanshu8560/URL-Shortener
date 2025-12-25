export default function Stats() {
    const stats = [
        {
            number: '10+',
            label: 'Links Shortened',
            gradient: 'from-purple-600 to-blue-600',
        },
        {
            number: '50+',
            label: 'Total Clicks',
            gradient: 'from-pink-600 to-purple-600',
        },
        {
            number: '99.9%',
            label: 'Uptime SLA',
            gradient: 'from-blue-600 to-cyan-600',
        },
        {
            number: '<100ms',
            label: 'Avg Response Time',
            gradient: 'from-cyan-600 to-teal-600',
        },
    ];

    return (
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"></div>
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                        Trusted by Thousands
                        <span className="gradient-text"> Worldwide</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join the growing community of users who rely on our platform for their link management needs.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="glass rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Number with Gradient */}
                            <div className={`text-5xl sm:text-6xl font-extrabold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                {stat.number}
                            </div>

                            {/* Label */}
                            <div className="text-gray-700 font-semibold text-lg">
                                {stat.label}
                            </div>

                            {/* Decorative Line */}
                            <div className={`mt-4 h-1 w-16 mx-auto rounded-full bg-gradient-to-r ${stat.gradient}`}></div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-6 font-medium">Trusted by leading companies</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        <div className="text-2xl font-bold text-gray-400">ACME Corp</div>
                        <div className="text-2xl font-bold text-gray-400">TechStart</div>
                        <div className="text-2xl font-bold text-gray-400">GlobalNet</div>
                        <div className="text-2xl font-bold text-gray-400">DataFlow</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
