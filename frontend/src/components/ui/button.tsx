
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  ...props 
}) => {
  const variants = {
    default: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
    destructive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white/50 bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 hover:border-white/70 shadow-lg',
    secondary: 'bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 shadow-lg',
    ghost: 'hover:bg-white/20 text-white',
    link: 'text-white hover:underline',
  };

  const sizes = {
    default: 'h-11 px-6 py-2 text-base font-semibold',
    sm: 'h-9 px-4 text-sm font-semibold',
    lg: 'h-14 px-10 text-lg font-bold',
    icon: 'h-11 w-11',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};
