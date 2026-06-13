
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ className = '', ...props }) => (
  <select
    className={`w-full rounded-xl border-2 border-white/40 bg-black/30 backdrop-blur-xl px-4 py-3 text-white focus:border-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 text-base ${className}`}
    {...props}
  />
);
