"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // Error toast — ensure text is always readable on all devices
          "--error-bg": "#FEF2F2",
          "--error-text": "#7F1D1D",
          "--error-border": "#FCA5A5",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          // Force readable text color in all toast descriptions
          color: "var(--ink)",
        },
        error: {
          style: {
            background: "#FEF2F2",
            color: "#7F1D1D",
            border: "1px solid #FCA5A5",
          },
          descriptionStyle: {
            color: "#991B1B",
          },
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
