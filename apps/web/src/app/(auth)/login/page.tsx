import type { Metadata } from "next";
export const metadata: Metadata = { title: "Masuk" };
export default function LoginPage() {
  return (
    <section className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-2 text-sm text-muted-foreground">Halaman login — segera tersedia dari Kaizo.</p>
    </section>
  );
}
