"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PredictPage() {
  const router = useRouter();
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/predict`, {
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
      alert("Erreur réseau. Vérifiez votre backend.");
    } finally {
      setLoading(false);
    }
  };

  const getRetentionPlan = async () => {
    if (!prediction?.prediction_id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/generate-retention-plan`, {
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
      alert("Erreur Gemini");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setEmployee({ ...employee, [field]: value });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Retention<span className="text-indigo-600">AI</span></h1>
            <p className="text-slate-500 font-bold">Système d'Analyse Prédictive RH</p>
          </div>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition">Déconnexion</button>
        </div>

        <div className="bg-white shadow-2xl rounded-[2rem] border border-slate-200 overflow-hidden">
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
            
            {/* COL 1: Profil */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-sm uppercase tracking-widest border-b pb-2">Profil Employé</h3>
              <div>
                <label className="block text-xs font-black mb-1">Âge</label>
                <input type="number" className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.Age} onChange={(e) => updateField("Age", parseInt(e.target.value))}/>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Genre</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.Gender} onChange={(e) => updateField("Gender", e.target.value)}>
                  <option value="Male">Male</option><option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">État Civil</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.MaritalStatus} onChange={(e) => updateField("MaritalStatus", e.target.value)}>
                  <option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Éducation (Niveau 1-5)</label>
                <input type="number" min="1" max="5" className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.Education} onChange={(e) => updateField("Education", parseInt(e.target.value))}/>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Domaine d'Études</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.EducationField} onChange={(e) => updateField("EducationField", e.target.value)}>
                  {["Life Sciences", "Medical", "Marketing", "Technical Degree", "Human Resources", "Other"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* COL 2: Job & Entreprise */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-sm uppercase tracking-widest border-b pb-2">Poste & Travail</h3>
              <div>
                <label className="block text-xs font-black mb-1">Département</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.Department} onChange={(e) => updateField("Department", e.target.value)}>
                  {["Sales", "Research & Development", "Human Resources"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Rôle</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.JobRole} onChange={(e) => updateField("JobRole", e.target.value)}>
                  {["Sales Executive", "Research Scientist", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Voyages d'Affaires</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.BusinessTravel} onChange={(e) => updateField("BusinessTravel", e.target.value)}>
                  <option value="Non-Travel">Non-Travel</option><option value="Travel_Rarely">Travel_Rarely</option><option value="Travel_Frequently">Travel_Frequently</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Heures Supplémentaires</label>
                <select className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.OverTime} onChange={(e) => updateField("OverTime", e.target.value)}>
                  <option value="Yes">Yes</option><option value="No">No</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black mb-1">Niveau Job</label>
                  <input type="number" className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.JobLevel} onChange={(e) => updateField("JobLevel", parseInt(e.target.value))}/>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1">Stock Options</label>
                  <input type="number" className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.StockOptionLevel} onChange={(e) => updateField("StockOptionLevel", parseInt(e.target.value))}/>
                </div>
              </div>
            </div>

            {/* COL 3: Satisfaction & Metrics */}
            <div className="space-y-4">
              <h3 className="text-indigo-600 font-black text-sm uppercase tracking-widest border-b pb-2">Satisfaction & Revenus</h3>
              <div>
                <label className="block text-xs font-black mb-1">Revenu Mensuel ($)</label>
                <input type="number" className="w-full p-2 bg-slate-50 border-2 border-indigo-200 rounded-lg font-bold text-indigo-700 text-lg" value={employee.MonthlyIncome} onChange={(e) => updateField("MonthlyIncome", parseInt(e.target.value))}/>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><label className="font-black">Env. Sat (1-4)</label><input type="number" className="w-full p-1 bg-slate-50 border rounded" value={employee.EnvironmentSatisfaction} onChange={(e) => updateField("EnvironmentSatisfaction", parseInt(e.target.value))}/></div>
                <div><label className="font-black">Job Sat (1-4)</label><input type="number" className="w-full p-1 bg-slate-50 border rounded" value={employee.JobSatisfaction} onChange={(e) => updateField("JobSatisfaction", parseInt(e.target.value))}/></div>
                <div><label className="font-black">Involvement (1-4)</label><input type="number" className="w-full p-1 bg-slate-50 border rounded" value={employee.JobInvolvement} onChange={(e) => updateField("JobInvolvement", parseInt(e.target.value))}/></div>
                <div><label className="font-black">Relation Sat (1-4)</label><input type="number" className="w-full p-1 bg-slate-50 border rounded" value={employee.RelationshipSatisfaction} onChange={(e) => updateField("RelationshipSatisfaction", parseInt(e.target.value))}/></div>
              </div>
              <div>
                <label className="block text-xs font-black mb-1">Total Expérience (Années)</label>
                <input type="number" className="w-full p-2 bg-slate-50 border-2 border-slate-200 rounded-lg font-bold" value={employee.TotalWorkingYears} onChange={(e) => updateField("TotalWorkingYears", parseInt(e.target.value))}/>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[9px]">
                <div><label className="font-black italic">Années Boite</label><input type="number" className="w-full p-1 border rounded" value={employee.YearsAtCompany} onChange={(e) => updateField("YearsAtCompany", parseInt(e.target.value))}/></div>
                <div><label className="font-black italic">Années Rôle</label><input type="number" className="w-full p-1 border rounded" value={employee.YearsInCurrentRole} onChange={(e) => updateField("YearsInCurrentRole", parseInt(e.target.value))}/></div>
                <div><label className="font-black italic">Années Manager</label><input type="number" className="w-full p-1 border rounded" value={employee.YearsWithCurrManager} onChange={(e) => updateField("YearsWithCurrManager", parseInt(e.target.value))}/></div>
              </div>
            </div>

            <div className="md:col-span-3 pt-4 border-t">
               <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-black mb-1">Performance Rating (1-4)</label>
                    <input type="range" min="1" max="4" className="w-full accent-indigo-600" value={employee.PerformanceRating} onChange={(e) => updateField("PerformanceRating", parseInt(e.target.value))}/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-black mb-1">Work Life Balance (1-4)</label>
                    <input type="range" min="1" max="4" className="w-full accent-indigo-600" value={employee.WorkLifeBalance} onChange={(e) => updateField("WorkLifeBalance", parseInt(e.target.value))}/>
                  </div>
               </div>
               <button onClick={handlePredict} disabled={loading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1">
                {loading ? "CALCUL DES RISQUES..." : "LANCER L'INTELLIGENCE PRÉDICTIVE"}
              </button>
            </div>
          </div>
        </div>

        {prediction && (
          <div className="mt-12 bg-white p-10 rounded-[2rem] border-4 border-slate-900 shadow-2xl flex flex-col items-center">
            <h2 className="text-xl font-black text-slate-400 uppercase italic">Résultat de la simulation</h2>
            <div className={`text-8xl font-black my-4 ${prediction.churn_probability > 0.5 ? "text-red-600" : "text-emerald-600"}`}>
              {(prediction.churn_probability * 100).toFixed(1)}%
            </div>
            <p className="text-slate-900 font-bold mb-8">Probabilité de départ de l'employé</p>
            
            <button onClick={getRetentionPlan} className="bg-slate-900 text-white px-12 py-4 rounded-full font-black hover:bg-indigo-600 transition-all flex items-center gap-2">
              🤖 GÉNÉRER UN PLAN D'ACTION GEMINI
            </button>

            {plan && (
              <div className="mt-10 p-8 bg-indigo-50 rounded-3xl border-2 border-indigo-200 w-full">
                <h4 className="font-black text-indigo-900 mb-4 border-b border-indigo-200 pb-2">STRATÉGIE DE RÉTENTION CONSEILLÉE :</h4>
                <div className="text-indigo-900 leading-relaxed font-bold whitespace-pre-wrap">{plan}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}