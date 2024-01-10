export const metadata = {
  title: "Negation Game",
  description: "The way extraterrestrials do governance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
