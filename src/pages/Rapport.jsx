import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../api/Api";
import adkarList from "../assets/adkar";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const typeKeys = {
  ayah: "typeAyah",
  hadith: "typeHadith",
  dhikr: "typeDhikr",
};

const Rapport = () => {
  const { t } = useTranslation();
  const [eleves, setEleves] = useState([]);
  const [selectedEleveId, setSelectedEleveId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);
  const [currentAdkar, setCurrentAdkar] = useState(0);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const response = await api.get("api/eleve?size=1000");
        setEleves(response.data.content);
      } catch (error) {
        toast.error(t("rapport.loadElevesError"));
      }
    };

    fetchEleves();
  }, []);

  useEffect(() => {
    if (!loading) return;
    setCurrentAdkar(Math.floor(Math.random() * adkarList.length));
    const id = setInterval(() => {
      setCurrentAdkar((prev) => (prev + 1) % adkarList.length);
    }, 4000);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const downloadPdf = (url, id) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadPdf = async (id) => {
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const response = await api.get(`api/ai/rapport/${id}/file`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      setPdfUrl(url);
      setGeneratedId(id);
      downloadPdf(url, id);
    } catch (error) {
      toast.error(t("rapport.pdfError"));
    }
  };

  const generateRapport = async () => {
    if (!selectedEleveId) return;

    setLoading(true);
    setResult("");
    try {
      const response = await api.post(`api/ai/rapport/${selectedEleveId}`);
      setResult(response.data);
      toast.success(t("rapport.generateSuccess"));
      await loadPdf(selectedEleveId);
    } catch (error) {
      toast.error(t("rapport.generateError"));
    } finally {
      setLoading(false);
    }
  };

  const redownload = () => {
    if (pdfUrl) downloadPdf(pdfUrl, generatedId);
  };

  const adkar = adkarList[currentAdkar];

  return (
    <>
      <style>{`
        @keyframes adkarFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <div className="content">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[#c79a3b]/40" />
                <span className="select-none text-sm leading-none text-[#c79a3b]">۞</span>
                <span className="h-px flex-1 bg-[#c79a3b]/40" />
              </div>
              <h2 className="text-right font-serif text-lg font-semibold tracking-tight text-(--text)">
                {t("rapport.title")}
              </h2>
              <p className="text-right text-xs text-(--text-muted)">
                {t("rapport.welcome")}
              </p>
            </div>

            <div className="mt-5 rounded-[20px] border border-(--border) bg-(--surface) p-2 shadow-[0_1px_2px_rgba(11,32,24,0.06),0_8px_24px_-12px_rgba(11,32,24,0.18)]">
              <div className="rounded-[14px] border border-[#c79a3b]/35 bg-[#fbfaf6] p-6">
                <div className="flex items-end gap-3">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-[11px] font-medium uppercase tracking-wider text-[#0f3d2e]">
                      {t("rapport.selectEleve")}
                    </label>
                    <select
                      value={selectedEleveId}
                      onChange={(e) => setSelectedEleveId(e.target.value)}
                      disabled={loading}
                      className="w-full border rounded-lg border-[#0f3d2e]/20 bg-white px-3 py-2 text-xs text-(--text) shadow-[inset_0_1px_2px_rgba(11,32,24,0.06)] focus:border-[#0f3d2e] focus:outline-none disabled:opacity-50"
                    >
                      <option value="">{t("rapport.selectElevePlaceholder")}</option>
                      {eleves.map((eleve) => (
                        <option key={eleve.id} value={eleve.id}>
                          {eleve.prenom} {eleve.nom} ({eleve.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={generateRapport}
                    disabled={!selectedEleveId || loading}
                    className="flex items-center gap-2 rounded-lg bg-[#0f3d2e] px-5 py-2 text-xs font-medium text-[#f3efe3] transition-all hover:-translate-y-px hover:bg-[#12493a] hover:shadow-[0_4px_14px_-4px_rgba(15,61,46,0.5)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#f3efe3]/40 border-t-[#f3efe3]" />
                        {t("rapport.generating")}
                      </>
                    ) : (
                      <>
                        <span className="select-none text-[10px] leading-none text-[#d9b45f]">✦</span>
                        {t("rapport.generate")}
                      </>
                    )}
                  </button>
                </div>

                {!loading && (
                  <div className="mt-5 flex items-center gap-3 text-[11px] text-(--text-muted)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5 text-[#c79a3b]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <span>{t("rapport.welcome")}</span>
                  </div>
                )}

                {loading && adkar && (
                  <div
                    key={currentAdkar}
                    className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-[#c79a3b]/30 bg-[#f6f0e0]/60 px-6 py-7 text-center"
                    style={{ animation: "adkarFadeIn 0.5s ease forwards" }}
                  >
                    <span className="select-none text-base leading-none text-[#c79a3b]">۞</span>

                    <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#c79a3b]">
                      {t("rapport.adhkarTitle")}
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c79a3b]/45 bg-white/70 px-3 py-1 text-[10px] font-semibold text-[#0f3d2e]">
                      <span className="select-none text-[9px] text-[#c79a3b]">✦</span>
                      {t(typeKeys[adkar.type])}
                    </span>

                    <p className="max-w-lg font-serif text-[17px] leading-[2.1] text-(--text)">
                      {adkar.arabic}
                    </p>

                    <span className="flex items-center gap-2 text-[11px] text-(--text-muted)">
                      <span className="h-px w-6 bg-[#c79a3b]/40" />
                      {adkar.reference}
                      <span className="h-px w-6 bg-[#c79a3b]/40" />
                    </span>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#0f3d2e]">
                    {t("rapport.result")}
                  </span>
                  <div className="min-h-[72px] rounded-lg border border-(--border) bg-white px-3 py-2 whitespace-pre-wrap text-xs leading-relaxed text-(--text)">
                    {result ||
                      (generatedId
                        ? `${t("rapport.pdfSaved")} ${t("rapport.download")}`
                        : t("rapport.resultPlaceholder"))}
                  </div>
                </div>

                {pdfUrl && (
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#c79a3b]/30 pt-4">
                    <p className="flex items-center gap-2 text-[11px] text-(--text-muted)">
                      <span className="select-none text-[10px] text-[#c79a3b]">✓</span>
                      {t("rapport.pdfSaved")}
                    </p>
                    <button
                      onClick={redownload}
                      className="flex items-center gap-2 rounded-lg bg-[#0f3d2e] px-4 py-1.5 text-xs font-medium text-[#f3efe3] transition-all hover:-translate-y-px hover:bg-[#12493a] hover:shadow-[0_4px_14px_-4px_rgba(15,61,46,0.5)]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      {t("rapport.download")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Rapport;