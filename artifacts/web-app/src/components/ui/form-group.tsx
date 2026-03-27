import * as React from "react";

export function FormGroup({ 
  label, 
  error, 
  children 
}: { 
  label: string; 
  error?: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground/90">{label}</label>
      {children}
      {error && (
        <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
