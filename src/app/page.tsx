'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Header} from '@/components/Header';
import {Settings, Truck, TrendingUp, Leaf} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Route Optimization',
      description: 'Calculate the most efficient delivery routes to save time, fuel, and reduce environmental impact.',
      icon: Truck,
    },
    {
      title: 'Inventory Management',
      description: 'Monitor stock levels in real-time, automate reordering, and optimize inventory distribution across warehouses.',
      icon: Settings,
    },
    {
      title: 'Demand Forecasting',
      description: 'Predict future inventory needs using AI and machine learning to prevent stockouts and overstock situations.',
      icon: TrendingUp,
    },
    {
      title: 'Carbon Footprint Tracking',
      description: 'Monitor and reduce your environmental impact with detailed carbon emissions analytics and reporting.',
      icon: Leaf,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground py-20 px-6 md:px-12 lg:px-24 text-center md:text-left">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="heroContent flex-1 max-w-md mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">PathX</span>
            </h1>
            <p className="text-xl text-primary mb-6">
              Sustainable Supply Chain Optimization
            </p>
            <p className="text-md leading-relaxed text-muted-foreground mb-8">
              Transform your logistics operations with real-time analytics,
              AI-driven insights, and sustainable route optimization to reduce
              costs and environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
              <Link href="/dashboard">
                <Button className="text-lg bg-primary text-white hover:bg-primary/90">
                  Go to Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="text-lg text-primary hover:bg-accent hover:text-accent-foreground">
                Learn More
              </Button>
            </div>
          </div>

          <div className="analyticsCard bg-[#242f3f] rounded-lg shadow-md p-6 w-full max-w-sm mt-8 md:mt-0 md:ml-8" style={{marginLeft: '330px'}}>
            <div className="analyticsHeader flex justify-between items-center mb-4">
              <div className="analyticsDots flex gap-2">
                <span className="block w-3 h-3 rounded-full bg-[#ff6059]"></span>
                <span className="block w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                <span className="block w-3 h-3 rounded-full bg-[#27c93f]"></span>
              </div>
              <span className="text-sm text-[#9ca3af]">PathX Analytics</span>
            </div>
            <div className="analyticsResults">
              <p className="text-[#f97316]">// Route optimization results</p>
              <div className="analyticsMetrics flex justify-between mb-2">
                <p className="text-[#9ca3af]">Distance savings:</p>
                <p className="text-[#f3f4f6]">14.8 km</p>
              </div>
              <div className="analyticsMetrics flex justify-between mb-2">
                <p className="text-[#9ca3af]">Fuel reduction:</p>
                <p className="text-[#f3f4f6]">2.3 gallons</p>
              </div>
              <div className="analyticsMetrics flex justify-between mb-2">
                <p className="text-[#9ca3af]">CO2 reduction:</p>
                <p className="text-[#f3f4f6]">18.5 kg</p>
              </div>
              <div className="analyticsMetrics flex justify-between mb-2">
                <p className="text-[#9ca3af]">Time saved:</p>
                <p className="text-[#f3f4f6]">32 minutes</p>
              </div>
              <div className="analyticsMetrics flex justify-between">
                <p className="text-[#9ca3af]">Status:</p>
                <p className="text-[#27c93f] font-bold">Optimized</p>
              </div>
            </div>
            <p className="text-xs text-[#9ca3af] text-right mt-4">
              Real-time logistics optimization
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md p-6 h-full flex flex-col">
                <div className="flex justify-center text-primary mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 text-center">{feature.title}</h3>
                <p className="text-md text-muted-foreground text-center flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground w-full">
        <p>© {new Date().getFullYear()} PathX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
