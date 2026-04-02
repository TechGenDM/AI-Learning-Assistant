import React from 'react';

const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md', // sm, md, lg
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200',
    outline:
      'border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-500 bg-transparent',
    danger:
      'bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105',
    ghost: 
      'bg-transparent hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${variant === 'outline' || variant === 'ghost' ? 'border-emerald-500' : 'border-white'}`}></span>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 22} />
      ) : null}
      
      {children}
    </button>
  );
};

export default Button;