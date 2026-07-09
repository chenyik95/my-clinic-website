import Image from "next/image";
import Link from "next/link";
import { CLINIC } from "@/lib/clinic";
import { cn } from "@/lib/utils";

type ClinicLogoProps = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
};

const imageSizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

/** Smaller type for the full legal name so it fits the nav without crowding */
const nameSizeClasses = {
  sm: "text-[0.6875rem] leading-[1.2] sm:text-[0.75rem] md:text-[0.8125rem] max-w-[9.5rem] sm:max-w-[12.5rem] md:max-w-[16rem]",
  md: "text-sm leading-snug max-w-[14rem] sm:max-w-none",
  lg: "text-base leading-snug",
};

export function ClinicLogo({
  className,
  imageClassName,
  showName = false,
  href = "/",
  size = "sm",
}: ClinicLogoProps) {
  const content = (
    <>
      <Image
        src={CLINIC.logoSrc}
        alt={CLINIC.name}
        width={56}
        height={56}
        priority
        className={cn(
          "rounded-full object-cover shrink-0",
          imageSizeClasses[size],
          imageClassName
        )}
      />
      {showName && (
        <span
          className={cn(
            "font-serif font-medium text-secondary tracking-tight",
            nameSizeClasses[size]
          )}
        >
          {CLINIC.name}
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 min-w-0 shrink", className)}
    >
      {content}
    </Link>
  );
}
