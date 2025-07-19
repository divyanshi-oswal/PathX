'use server';

import React from 'react';
import {generateBlogContent} from '@/ai/flows/generate-blog-content';
import styles from './blog.module.css';

const AIFirstMindsetBlogPage: React.FC = async () => {
  const content = await generateBlogContent({
    topic: 'How an AI-First Mindset Is Reinventing Supply Chain Operations',
  });
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        How an AI-First Mindset Is Reinventing Supply Chain Operations
      </h1>
      <div className={styles.content}>{content.content}</div>
    </div>
  );
};

export default AIFirstMindsetBlogPage;
