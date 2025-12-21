"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Erreur");
      localStorage.setItem("access_token", data.access_token);
      router.push("/predict");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-200">
        <h2 className="text-4xl font-black mb-2 text-slate-900 uppercase italic tracking-tighter text-center">Connexion</h2>
        <p className="text-slate-500 text-center font-bold mb-8">Accédez à votre tableau de bord RH</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-slate-900 font-bold placeholder-slate-400"/>
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-slate-900 font-bold placeholder-slate-400"/>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all font-black text-lg shadow-lg">
            {loading ? "VÉRIFICATION..." : "SE CONNECTER"}
          </button>
          {error && <p className="text-red-600 font-bold text-center mt-2">{error}</p>}
        </form>
        <p className="mt-8 text-center text-slate-600 font-bold">
          Nouveau ? <Link href="/register" className="text-indigo-600 hover:underline">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}