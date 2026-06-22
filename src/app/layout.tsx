// Root layout — minimal, just passes through to locale layout.
// The actual layout with fonts and providers lives in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
