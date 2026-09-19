import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FileText, Loader2 } from "lucide-react";
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
    <div className="app-layout">
      <Sidebar />
      <div className="main">
        <NavBar />
        <div className="content">
          <div className="page-header">
            <div>
              <h1 className="page-title">{t("rapport.title")}</h1>
              <p className="page-sub">{t("rapport.welcome")}</p>
            </div>
          </div>

          <section className="panel">
            <div className="panel-body">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-1 flex-col gap-1.5 min-w-56">
                  <label className="label-trad">{t("rapport.selectEleve")}</label>
                  <select
                    value={selectedEleveId}
                    onChange={(e) => setSelectedEleveId(e.target.value)}
                    disabled={loading}
                    className="input-trad"
                  >
                    <option value="">
                      {t("rapport.selectElevePlaceholder")}
                    </option>
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
                  className="btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {t("rapport.generating")}
                    </>
                  ) : (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      {t("rapport.generate")}
                    </>
                  )}
                </button>
              </div>

              {loading && adkar && (
                <div
                  key={currentAdkar}
                  className="mt-5 flex flex-col items-center gap-3 border border-(--border) bg-(--bg) rounded-(--r-sm) px-6 py-7 text-center"
                >
                  <span className="badge badge-ink">
                    {t(typeKeys[adkar.type])}
                  </span>
                  <p className="font-display text-[17px] leading-[2.1] text-(--text)">
                    {adkar.arabic}
                  </p>
                  <span className="text-[11px] text-(--text-muted)">
                    {adkar.reference}
                  </span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-1.5">
                <span className="label-trad">{t("rapport.result")}</span>
                <div className="min-h-[72px] rounded-(--r-sm) border border-(--border) bg-(--bg) px-3.5 py-2.5 whitespace-pre-wrap text-[13px] leading-relaxed text-(--text)">
                  {result ||
                    (generatedId
                      ? `${t("rapport.pdfSaved")} ${t("rapport.download")}`
                      : t("rapport.resultPlaceholder"))}
                </div>
              </div>

              {pdfUrl && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4">
                  <p className="flex items-center gap-2 text-[12px] text-(--text-2)">
                    <FileText className="h-3.5 w-3.5 text-(--brand)" />
                    {t("rapport.pdfSaved")}
                  </p>
                  <button onClick={redownload} className="btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    {t("rapport.download")}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Rapport;