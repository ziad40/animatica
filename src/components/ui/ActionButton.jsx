import React from 'react';

// Simple reusable action button
// props:
// - variant: 'green' | 'red' | 'submit' | 'validate' | any custom key mapped in VARIANT_STYLES
// - type: HTML button type attribute ("button" | "submit" | "reset")
// - disabled, onClick, title, children, className
const VARIANT_STYLES = {
  green: {
    base: 'bg-green-600 hover:bg-green-700',
    disabled: 'bg-green-400 cursor-not-allowed opacity-70'
  },
  red: {
    base: 'bg-red-600 hover:bg-red-700',
    disabled: 'bg-red-400 cursor-not-allowed opacity-70'
  },
  // semantic aliases
  submit: {
    // primary positive action (same visual as green)
    base: 'bg-green-600 hover:bg-green-700',
    disabled: 'bg-green-400 cursor-not-allowed opacity-70'
  },
  retry: {
    // validation / confirm style (use indigo for contrast)
    base: 'bg-yellow-400 hover:bg-indigo-700',
    disabled: 'bg-yellow-200 cursor-not-allowed opacity-70'
  }
};

const ActionButton = ({ variant = 'green', type = 'button', disabled = false, onClick, title, children, className = '' }) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.green;
  const classes = `inline-flex items-center gap-2 px-3 py-2 rounded-md font-medium text-white shadow-sm focus:outline-none transition-colors ${disabled ? styles.disabled : styles.base} ${className}`;
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default ActionButton;
