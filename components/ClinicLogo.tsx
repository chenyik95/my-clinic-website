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

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
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
          "rounded-full object-cover",
          sizeClasses[size],
          imageClassName
        )}
      />
      {showName && (
        <span className="font-serif font-semibold text-secondary tracking-tight">
          Zen Pulse
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 shrink-0", className)}
    >
      {content}
    </Link>
  );
}