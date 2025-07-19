'use server';

import React from 'react';
import {generateBlogContent} from '@/ai/flows/generate-blog-content';
import styles from '../blog.module.css';

const InsightBasedPlanningBlogPage: React.FC = async () => {
  const content = await generateBlogContent({
    topic: 'From Traditional Planning to Insight-Based Planning: A New Approach',
  });
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        From Traditional Planning to Insight-Based Planning: A New Approach
      </h1>
      <div className={styles.content}>{content.content}</div>
    </div>
  );
};

export default InsightBasedPlanningBlogPage;


