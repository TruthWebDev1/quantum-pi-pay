
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PiButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}

const PiButton: React.FC<PiButtonProps> = ({ 
  className,
  variant = "primary",
  size = "default",
  isLoading = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  ...props
}) => {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center font-medium transition-all",
    size === "sm" && "h-9 px-4 py-2 text-sm",
    size === "default" && "h-11 px-6 py-2.5",
    size === "lg" && "h-12 px-8 py-3",
  );
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        isLoading && "opacity-80 pointer-events-none",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        iconLeft && <span className="mr-2">{iconLeft}</span>
      )}
      {children}
      {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
    </Button>
  );
};

export default PiButton;
