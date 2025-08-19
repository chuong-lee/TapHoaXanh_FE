'use client';

import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'compact' | 'normal' | 'large';
  hover?: boolean;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

export function Card({
  children,
  variant,
  size = 'normal',
  hover = false,
  className = ''
}: CardProps) {
  const cardClasses = [
    styles.card,
    size !== 'normal' && styles[size],
    hover && styles.hover,
    variant && styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, children }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function CardBody({ children }: CardBodyProps) {
  return (
    <div className={styles.body}>
      {children}
    </div>
  );
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <div className={styles.footer}>
      {children}
    </div>
  );
}
