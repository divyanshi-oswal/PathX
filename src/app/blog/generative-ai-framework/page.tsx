'use server';

import React from 'react';
import {generateBlogContent} from '@/ai/flows/generate-blog-content';
import styles from '../blog.module.css';

const GenerativeAIFrameworkBlogPage: React.FC = async () => {
  const content = await generateBlogContent({
    topic: 'A Framework for Generative AI Readiness and Supply Chain Maturity in 8 Steps',
  });
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        A Framework for Generative AI Readiness and Supply Chain Maturity in 8 Steps
      </h1>
      <div className={styles.content}>{content.content}</div>
    </div>
  );
};

export default GenerativeAIFrameworkBlogPage;

