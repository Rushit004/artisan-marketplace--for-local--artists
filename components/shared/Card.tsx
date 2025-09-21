

import React from 'react';

// Fix: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, ...props }) => {
  return (
    // Fix: Spread additional props to the underlying div element.
    <div className={`bg-white rounded-xl shadow-md p-4 sm:p-6 transition-shadow hover:shadow-lg ${className}`} {...props}>
      {title && (
        <h3 className="text-lg font-semibold font-serif text-brand-primary mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};
