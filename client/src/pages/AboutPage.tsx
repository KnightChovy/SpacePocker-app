import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description:
        'We believe in building strong communities by connecting people through shared spaces.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description:
        'Constantly improving our platform to make space booking seamless and efficient.',
    },
    {
      icon: Award,
      title: 'Quality',
      description:
        'We ensure every space meets our high standards for comfort and functionality.',
    },
    {
      icon: Heart,
      title: 'Trust',
      description:
        'Building lasting relationships through transparency and reliable service.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        <section className="relative bg-linear-to-br from-primary via-indigo-600 to-purple-700 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                About SpacePocker
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Transforming the way people discover, book, and manage spaces
                for work, events, and collaboration.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 mb-4">
                  At SpacePocker, we're on a mission to make premium spaces
                  accessible to everyone. Whether you're hosting a meeting,
                  organizing an event, or need a quiet place to focus, we
                  connect you with the perfect space.
                </p>
                <p className="text-lg text-slate-600">
                  Founded in 2024, we've helped thousands of individuals and
                  businesses find their ideal workspace. Our platform combines
                  cutting-edge technology with personalized service to deliver
                  an exceptional booking experience.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
                  alt="Modern Office Space"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-slate-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10,000+', label: 'Spaces Listed' },
                { number: '50,000+', label: 'Happy Customers' },
                { number: '100+', label: 'Cities' },
                { number: '98%', label: 'Satisfaction Rate' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
