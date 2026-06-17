
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-xl border-2 border-white/40 bg-black/30 backdrop-blur-xl px-4 py-3 text-white placeholder-white/60 focus:border-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 text-base ${className}`}
    {...props}
  />
);
