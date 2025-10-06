import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// @ts-ignore
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Apply classes to the inner container (the one with max width + padding) */
  containerClassName?: string;
  /** Apply classes to the <h2> title */
  headingClassName?: string;
  /** Apply classes to the content wrapper (defaults to prose styles) */
  contentClassName?: string;
  /** Control showing the separator under the title */
  separator?: boolean;
  /** Override the max width (e.g., "max-w-6xl" | "max-w-7xl") */
  maxWidthClassName?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      id,
      title,
      description,
      children,
      className,
      containerClassName,
      headingClassName,
      contentClassName,
      separator = true,
      maxWidthClassName = "max-w-5xl",
      ...props
    },
    ref
  ) => {
    return (
      <section
        id={id}
        ref={ref}
        aria-label={typeof title === "string" ? title : undefined}
        className={cn("scroll-mt-24 md:scroll-mt-28", className)}
        {...props}
      >
        <div className={cn("container", maxWidthClassName, containerClassName)}>
          {(title || description) && (
            <div>
              {title ? (
                <h2 className={cn("text-2xl md:text-4xl font-semibold tracking-tight", headingClassName)}>
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
              {separator && <Separator className="mb-6 mt-2" />}
            </div>
          )}

          <div className={cn("prose prose-zinc dark:prose-invert max-w-none", contentClassName)}>
            {children}
          </div>
        </div>
      </section>
    );
  }
);

Section.displayName = "Section";
