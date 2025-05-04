import * as React from "react";

import { cn } from "@/client/lib/utils";
import { useState } from "react";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, value, ...props }, ref) => {
  return (
    <div className="grow-wrap" data-replicated-value={value}>
      <textarea
        className={cn(
          "flex h-full w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
        name="text"
        value={value}
      ></textarea>
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
