"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/Register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Erreur inscription");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-200">
        <h2 className="text-4xl font-black mb-2 text-slate-900 uppercase italic tracking-tighter text-center">Inscription</h2>
        <p className="text-slate-500 text-center font-bold mb-8">Rejoignez RetentionAI dès aujourd'hui</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Futur Utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none text-slate-900 font-bold"/>
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none text-slate-900 font-bold"/>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition-all font-black text-lg shadow-lg">
            {loading ? "CRÉATION..." : "CRÉER MON COMPTE"}
          </button>
          {error && <p className="text-red-600 font-bold text-center mt-2">{error}</p>}
        </form>
        <p className="mt-8 text-center text-slate-600 font-bold">
          Déjà inscrit ? <Link href="/login" className="text-emerald-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}