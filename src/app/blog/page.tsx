import React from 'react';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {Header} from '@/components/Header';

const BlogPage: React.FC = () => {
  const blogArticles = [
    {
      title: 'A Framework for Generative AI Readiness and Supply Chain Maturity in 8 Steps',
      href: '/blog/generative-ai-framework',
    },
    {
      title: 'How an AI-First Mindset Is Reinventing Supply Chain Operations',
      href: '/blog/ai-first-mindset',
    },
    {
      title: 'From Traditional Planning to Insight-Based Planning: A New Approach',
      href: '/blog/insight-based-planning',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background">
      <Header />

      {/* Blog Section */}
      <section className="py-8 w-full">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
            Latest from Our Blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles.map((article, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md p-6">
                <span className="uppercase text-xs font-bold text-muted-foreground block mb-2">
                  Blog
                </span>
                <Link href={article.href} className="text-lg font-semibold text-foreground hover:text-primary">
                  {article.title}
                </Link>
                <Link href={article.href} className="inline-flex items-center mt-4 text-primary hover:underline">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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

export default BlogPage;
