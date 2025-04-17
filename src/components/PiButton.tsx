
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PiButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "primary" | "secondary" | "gold";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const PiButton: React.FC<PiButtonProps> = ({ 
  className,
  variant = "primary",
  isLoading = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = "relative font-medium rounded-lg transition-all flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-pi-purple text-white hover:bg-opacity-90",
    secondary: "bg-white text-pi-purple border border-pi-purple hover:bg-pi-purple hover:bg-opacity-5",
    gold: "bg-pi-gold text-pi-dark hover:bg-opacity-90",
  };
  
  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        isLoading && "opacity-80 pointer-events-none",
        className
      )}
      variant={undefined}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
    </Button>
  );
};

export default PiButton;
