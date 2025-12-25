export default function Features() {
    const features = [
        {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Create short links in milliseconds. Our optimized infrastructure ensures instant redirects worldwide.',
        },
        {
            icon: '📊',
            title: 'Advanced Analytics',
            description: 'Track clicks, analyze traffic patterns, and gain insights into your audience behavior.',
        },
        {
            icon: '🔒',
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with 99.9% uptime. Your links are safe and always accessible.',
        },
        {
            icon: '🎨',
            title: 'Custom Branding',
            description: 'Create memorable branded links with custom codes that reflect your brand identity.',
        },
        {
            icon: '🌐',
            title: 'Global CDN',
            description: 'Powered by a global content delivery network for blazing-fast redirects anywhere.',
        },
        {
            icon: '📱',
            title: 'Mobile Optimized',
            description: 'Fully responsive design that works seamlessly across all devices and platforms.',
        },
    ];

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                        Powerful Features for
                        <span className="gradient-text"> Modern Teams</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to create, manage, and track your short links effectively.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Gradient Border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
