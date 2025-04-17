
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface PaymentCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  status?: 'completed' | 'pending' | 'failed';
  onClick?: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
  status,
  onClick,
}) => {
  return (
    <Card 
      className={cn(
        "card-shadow card-hover", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {status && (
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-0.5 text-xs font-medium",
              status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
              status === 'pending' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
              "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
        {icon && <div className="h-8 w-8 rounded-full bg-pi-purple bg-opacity-10 flex items-center justify-center text-pi-purple">{icon}</div>}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' && !String(value).includes('π') ? `π ${value}` : value}
          </span>
          {trend && (
            <span 
              className={cn(
                "ml-2 text-xs font-medium",
                trend.positive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </CardContent>
      {onClick && (
        <CardFooter className="pt-0">
          <div className="text-xs text-pi-purple flex items-center">
            View details <ArrowUpRight size={14} className="ml-1" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentCard;
