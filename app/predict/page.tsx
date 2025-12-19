"use client";
import { useState } from "react";

export default function PredictPage() {
  const [employee, setEmployee] = useState({
    Age: 30,
    BusinessTravel: "Travel_Rarely",
    Department: "Sales",
    Education: 3,
    EducationField: "Life Sciences",
    EnvironmentSatisfaction: 3,
    Gender: "Male",
    JobInvolvement: 3,
    JobLevel: 1,
    JobRole: "Sales Executive",
    JobSatisfaction: 3,
    MaritalStatus: "Single",
    MonthlyIncome: 5000,
    OverTime: "No",
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 0,
    TotalWorkingYears: 5,
    WorkLifeBalance: 3,
    YearsAtCompany: 3,
    YearsInCurrentRole: 2,
    YearsWithCurrManager: 2
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(employee),
      });
      const data = await res.json();
      setPrediction(data);
      setPlan(null);
    } catch (err) {
      alert("Erreur lors de la prédiction. Vérifiez que le backend est lancé.");
    } finally {
      setLoading(false);
    }
  };

  const getRetentionPlan = async () => {
    if (!prediction?.prediction_id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/generate-retention-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prediction_id: prediction.prediction_id }),
      });
      const data = await res.json();
      setPlan(data.retention_plan);
    } catch (err) {
      alert("Erreur lors de la génération du plan");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setEmployee({ ...employee, [field]: value });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Analyse RH Avancée</h1>
        <p className="text-slate-600 mb-8 font-medium">Saisissez les données détaillées de l'employé pour l'IA.</p>

        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* --- Section Informations Personnelles --- */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-700 uppercase text-xs tracking-wider">Profil & Education</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700">Âge</label>
                <input type="number" className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.Age} onChange={(e) => updateField("Age", parseInt(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Genre</label>
                <select className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.Gender} onChange={(e) => updateField("Gender", e.target.value)}>
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Domaine d'études</label>
                <select className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.EducationField} onChange={(e) => updateField("EducationField", e.target.value)}>
                  {["Life Sciences", "Medical", "Marketing", "Technical Degree", "Human Resources", "Other"].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* --- Section Travail & Rôle --- */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-700 uppercase text-xs tracking-wider">Poste & Département</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700">Département</label>
                <select className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.Department} onChange={(e) => updateField("Department", e.target.value)}>
                  <option value="Sales">Sales</option>
                  <option value="Research & Development">R&D</option>
                  <option value="Human Resources">HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Rôle</label>
                <select className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.JobRole} onChange={(e) => updateField("JobRole", e.target.value)}>
                  {["Sales Executive", "Research Scientist", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Heures Supplémentaires</label>
                <select className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.OverTime} onChange={(e) => updateField("OverTime", e.target.value)}>
                  <option value="Yes">Oui</option>
                  <option value="No">Non</option>
                </select>
              </div>
            </div>

            {/* --- Section Revenus & Expérience --- */}
            <div className="space-y-4">
              <h3 className="font-bold text-blue-700 uppercase text-xs tracking-wider">Revenu & Fidélité</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700">Salaire Mensuel ($)</label>
                <input type="number" className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.MonthlyIncome} onChange={(e) => updateField("MonthlyIncome", parseInt(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Années dans l'entreprise</label>
                <input type="number" className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.YearsAtCompany} onChange={(e) => updateField("YearsAtCompany", parseInt(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Equilibre Vie/Pro (1-4)</label>
                <input type="number" min="1" max="4" className="w-full p-2 border-2 border-slate-200 rounded-lg text-slate-900 font-bold" 
                  value={employee.WorkLifeBalance} onChange={(e) => updateField("WorkLifeBalance", parseInt(e.target.value))} />
              </div>
            </div>

            <div className="md:col-span-3 pt-6">
              <button onClick={handlePredict} disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl text-lg">
                {loading ? "ANALYSE EN COURS..." : "OBTENIR LE SCORE DE CHURN"}
              </button>
            </div>
          </div>
        </div>

        {/* --- Affichage des Résultats --- */}
        {prediction && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-8 rounded-3xl border-4 flex flex-col items-center shadow-2xl bg-white ${
              prediction.churn_probability > 0.5 ? "border-red-500" : "border-green-500"
            }`}>
              <h2 className="text-2xl font-black text-slate-800 mb-2 italic underline uppercase">Probabilité de départ</h2>
              <span className={`text-7xl font-black ${prediction.churn_probability > 0.5 ? "text-red-600" : "text-green-600"}`}>
                {(prediction.churn_probability * 100).toFixed(1)}%
              </span>
              
              <button onClick={getRetentionPlan} disabled={loading}
                className="mt-6 bg-slate-900 text-white px-10 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                DEMANDER UN PLAN À GEMINI AI
              </button>

              {plan && (
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 w-full text-slate-900">
                  <h4 className="font-black text-indigo-800 mb-3 uppercase tracking-widest">Plan d'action de rétention :</h4>
                  <p className="leading-relaxed whitespace-pre-wrap font-medium">{plan}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}