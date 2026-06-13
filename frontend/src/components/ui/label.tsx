
import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className = '', ...props }) => (
  <label className={`block text-sm font-semibold text-white/90 mb-2 ${className}`} {...props} />
);
