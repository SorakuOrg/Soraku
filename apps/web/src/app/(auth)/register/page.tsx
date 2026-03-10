import type { Metadata } from "next";
export const metadata: Metadata = { title: "Daftar" };
export default function RegisterPage() {
  return (
    <section className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Daftar</h1>
      <p className="mt-2 text-sm text-muted-foreground">Halaman registrasi — segera tersedia dari Kaizo.</p>
    </section>
  );
}
