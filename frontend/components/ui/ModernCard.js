import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const ModernCard = forwardRef(({ className, children, hover = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-xl border border-gray-200/60 shadow-sm transition-all duration-200",
      hover && "hover:shadow-md hover:border-gray-300/60 hover:-translate-y-0.5",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ModernCard.displayName = "ModernCard";

const ModernCardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));

ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    {...props}
  />
));

ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
));

ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

ModernCardContent.displayName = "ModernCardContent";

const ModernCardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

ModernCardFooter.displayName = "ModernCardFooter";

export { ModernCard, ModernCardHeader, ModernCardFooter, ModernCardTitle, ModernCardDescription, ModernCardContent };
