import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileDown,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import TreatmentFlowchart from "./TreatmentFlowchart";
import { getTreatmentReportText } from "./treatmentReportTranslations";
import TreatmentReportImages from "./TreatmentReportImages";

const TreatmentReport = ({
  report,
  sourceImages = [],
  language = "en-IN",
}) => {
  const text = getTreatmentReportText(language);

  const sections = useMemo(
    () => [
      "diagnosis",
      "images",
      "immediate",
      "fertilizer",
      "treatment",
      "flowchart",
      "monitoring",
      "followup",
      "prevention",
      "expert",
      "safety",
    ],
    [],
  );

  const [expanded, setExpanded] = useState(
    () => new Set(["diagnosis", "immediate", "fertilizer"]),
  );

  if (!report) {
    return null;
  }

  const primaryCondition = report.diagnosis?.primary_condition;

  const isExpanded = (section) => expanded.has(section);

  const toggleSection = (section) => {
    setExpanded((current) => {
      const next = new Set(current);

      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }

      return next;
    });
  };

  const expandAll = () => {
    setExpanded(new Set(sections));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div
      id="crop-doctor-treatment-report"
      className="pb-8 print:bg-white print:p-0"
    >
      <div className="overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-white shadow-[0_20px_60px_-25px_rgba(16,185,129,0.25)] dark:border-emerald-900/50 dark:bg-gray-900 print:rounded-none print:border-gray-300 print:shadow-none">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-teal-700 px-5 py-7 text-white sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/15 text-xl shadow-inner backdrop-blur-sm"
                  >
                    🩺
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">
                      AgriSense AI
                    </p>

                    <p className="mt-1 text-[11px] text-emerald-100/90">
                      Crop Doctor • Complete Treatment Guidance
                    </p>
                  </div>
                </div>

                <h2 className="mt-5 max-w-4xl text-2xl font-bold tracking-tight sm:text-3xl">
                  {report.title || text.completePlan}
                </h2>

                <p className="mt-2 max-w-4xl text-xs leading-6 text-emerald-50 sm:text-sm">
                  {report.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={exportPdf}
                className="no-print inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20"
              >
                <FileDown size={15} aria-hidden="true" />
                {text.exportPdf}
              </button>
            </div>

            <div className="no-print flex flex-wrap items-center gap-2 border-t border-white/15 pt-5">
              <button
                type="button"
                onClick={expandAll}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ChevronDown size={14} aria-hidden="true" />
                Expand All
              </button>

              <button
                type="button"
                onClick={collapseAll}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ChevronUp size={14} aria-hidden="true" />
                Collapse All
              </button>

              <span className="ml-auto hidden text-[10px] font-medium text-emerald-100/80 sm:block">
                {expanded.size} of {sections.length} sections expanded
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-950/40 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label={text.primaryCondition}
              value={primaryCondition || "Not available"}
              accent="emerald"
            />

            <SummaryCard
              label={text.severity}
              value={report.diagnosis?.severity || "unclear"}
              accent="amber"
              capitalize
            />

            <SummaryCard
              label={text.otherConditions}
              value={report.diagnosis?.other_conditions?.length || 0}
              accent="blue"
            />
          </div>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <ReportSection
            id="diagnosis"
            title={text.diagnosis}
            icon={<Stethoscope size={17} aria-hidden="true" />}
            expanded={isExpanded("diagnosis")}
            onToggle={() => toggleSection("diagnosis")}
          >
            <ReportListContent
              items={report.diagnosis?.why}
              accent="emerald"
            />
          </ReportSection>

          <ReportSection
            id="images"
            title={text.images}
            icon={
              <span aria-hidden="true" className="text-sm">
                📷
              </span>
            }
            expanded={isExpanded("images")}
            onToggle={() => toggleSection("images")}
          >
            <TreatmentReportImages images={sourceImages} title={text.images} />
          </ReportSection>

          <ReportSection
            id="immediate"
            title={text.immediate}
            icon={<CheckCircle2 size={17} aria-hidden="true" />}
            expanded={isExpanded("immediate")}
            onToggle={() => toggleSection("immediate")}
          >
            <ReportListContent
              items={report.immediate_actions}
              accent="green"
            />
          </ReportSection>

          <ReportSection
            id="fertilizer"
            title={text.fertilizer}
            icon={
              <span aria-hidden="true" className="text-sm">
                🌱
              </span>
            }
            expanded={isExpanded("fertilizer")}
            onToggle={() => toggleSection("fertilizer")}
          >
            <div className="space-y-5">
              {report.fertilizer_guidance?.overview && (
                <p className="text-xs leading-6 text-gray-600 dark:text-gray-300 sm:text-sm">
                  {report.fertilizer_guidance.overview}
                </p>
              )}

              {report.fertilizer_guidance?.nutrients?.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-950/60">
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="px-4 py-3 font-bold text-gray-500">
                            {text.nutrient}
                          </th>
                          <th className="px-4 py-3 font-bold text-gray-500">
                            {text.reason}
                          </th>
                          <th className="px-4 py-3 font-bold text-gray-500">
                            {text.guidance}
                          </th>
                          <th className="px-4 py-3 font-bold text-gray-500">
                            {text.confidence}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {report.fertilizer_guidance.nutrients.map(
                          (item, index) => (
                            <tr
                              key={`${item.nutrient}-${index}`}
                              className="border-b border-gray-50 last:border-0 dark:border-gray-800/60"
                            >
                              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                {item.nutrient}
                              </td>

                              <td className="px-4 py-3 leading-5 text-gray-600 dark:text-gray-300">
                                {item.reason}
                              </td>

                              <td className="px-4 py-3 leading-5 text-gray-600 dark:text-gray-300">
                                {item.guidance}
                              </td>

                              <td className="px-4 py-3 capitalize text-gray-500">
                                {item.confidence}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <ReportListContent
                title={text.fertilizerCategories}
                items={report.fertilizer_guidance?.fertilizer_categories}
                accent="green"
              />

              <ReportListContent
                title={text.avoid}
                items={report.fertilizer_guidance?.what_to_avoid}
                accent="amber"
              />

              {report.fertilizer_guidance?.soil_test_note && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                    {report.fertilizer_guidance.soil_test_note}
                  </p>
                </div>
              )}
            </div>
          </ReportSection>

          <ReportSection
            id="treatment"
            title={text.treatment}
            icon={<Stethoscope size={17} aria-hidden="true" />}
            expanded={isExpanded("treatment")}
            onToggle={() => toggleSection("treatment")}
          >
            <div className="space-y-3">
              {(report.treatment_steps || []).map((step, index) => (
                <div
                  key={`${step.step}-${index}`}
                  className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/40 print:break-inside-avoid"
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {step.step}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
                        {step.title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
                        {step.action}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <MiniInfo label={text.why} value={step.why} />
                        <MiniInfo label={text.timing} value={step.timing} />
                        <MiniInfo label={text.monitor} value={step.monitoring} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection
            id="flowchart"
            title={text.flowchart}
            icon={
              <span aria-hidden="true" className="text-sm">
                🔀
              </span>
            }
            expanded={isExpanded("flowchart")}
            onToggle={() => toggleSection("flowchart")}
          >
            <TreatmentFlowchart
              flowchart={report.flowchart}
              title={text.flowchart}
            />
          </ReportSection>

          <ReportSection
            id="monitoring"
            title={text.improvement}
            icon={<CheckCircle2 size={17} aria-hidden="true" />}
            expanded={isExpanded("monitoring")}
            onToggle={() => toggleSection("monitoring")}
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <ReportListContent
                title={text.improvement}
                items={report.monitoring_plan?.improvement_signs}
                accent="emerald"
              />

              <ReportListContent
                title={text.warnings}
                items={report.monitoring_plan?.warning_signs}
                accent="amber"
              />
            </div>
          </ReportSection>

          <ReportSection
            id="followup"
            title={text.followUp}
            icon={
              <span aria-hidden="true" className="text-sm">
                📊
              </span>
            }
            expanded={isExpanded("followup")}
            onToggle={() => toggleSection("followup")}
          >
            <ReportListContent
              items={report.monitoring_plan?.follow_up}
              accent="blue"
            />
          </ReportSection>

          <ReportSection
            id="prevention"
            title={text.prevention}
            icon={<ShieldCheck size={17} aria-hidden="true" />}
            expanded={isExpanded("prevention")}
            onToggle={() => toggleSection("prevention")}
          >
            <ReportListContent items={report.prevention} accent="teal" />
          </ReportSection>

          <ReportSection
            id="expert"
            title={text.expert}
            icon={<Stethoscope size={17} aria-hidden="true" />}
            expanded={isExpanded("expert")}
            onToggle={() => toggleSection("expert")}
          >
            <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 dark:border-purple-900/40 dark:bg-purple-950/20">
              <ul className="space-y-2">
                {(report.expert_help?.when_to_contact || []).map(
                  (item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="text-xs leading-5 text-purple-800 dark:text-purple-300"
                    >
                      • {item}
                    </li>
                  ),
                )}
              </ul>

              {report.expert_help?.reason && (
                <p className="mt-3 text-xs leading-5 text-purple-700 dark:text-purple-300">
                  {report.expert_help.reason}
                </p>
              )}
            </div>
          </ReportSection>

          <ReportSection
            id="safety"
            title={text.safety}
            icon={<ShieldCheck size={17} aria-hidden="true" />}
            expanded={isExpanded("safety")}
            onToggle={() => toggleSection("safety")}
          >
            <ReportListContent items={report.safety} accent="orange" />
          </ReportSection>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 print:break-inside-avoid">
            <p className="text-[11px] leading-5 text-amber-800 dark:text-amber-300">
              {report.disclaimer || text.disclaimer}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 text-center dark:border-gray-800 dark:bg-gray-950/30 print:hidden">
          <p className="text-[10px] font-medium text-gray-400">
            {text.printPdf}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReportSection = ({ id, title, icon, expanded, onToggle, children }) => {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 print:break-inside-avoid"
      data-section={id}
    >
      <button
        type="button"
        onClick={onToggle}
        className="no-print flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:px-5"
        aria-expanded={expanded}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-gray-900 dark:text-white sm:text-sm">
            {title}
          </span>
        </span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {expanded ? (
            <ChevronUp size={15} aria-hidden="true" />
          ) : (
            <ChevronDown size={15} aria-hidden="true" />
          )}
        </span>
      </button>

      <div
        className={
          expanded
            ? "border-t border-gray-100 dark:border-gray-800"
            : "hidden print:block"
        }
      >
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </section>
  );
};

const SummaryCard = ({ label, value, accent = "emerald", capitalize = false }) => {
  const accents = {
    emerald:
      "border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/20",
    amber:
      "border-amber-100 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20",
    blue: "border-blue-100 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/20",
  };

  const dots = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`rounded-2xl border p-4 ${accents[accent]}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dots[accent]}`} />
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-sm font-bold text-gray-900 dark:text-white ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const ReportListContent = ({ title, items = [], accent = "emerald" }) => {
  if (!items?.length) {
    return null;
  }

  const bullets = {
    emerald: "bg-emerald-500 ring-emerald-100 dark:ring-emerald-950",
    green: "bg-green-500 ring-green-100 dark:ring-green-950",
    amber: "bg-amber-500 ring-amber-100 dark:ring-amber-950",
    blue: "bg-blue-500 ring-blue-100 dark:ring-blue-950",
    teal: "bg-teal-500 ring-teal-100 dark:ring-teal-950",
    orange: "bg-orange-500 ring-orange-100 dark:ring-orange-950",
  };

  return (
    <div>
      {title && (
        <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
          {title}
        </h4>
      )}

      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-3 text-xs leading-5 text-gray-600 dark:text-gray-300"
          >
            <span
              aria-hidden="true"
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ring-4 ${bullets[accent]}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MiniInfo = ({ label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900/70">
    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
      {label}
    </p>
    <p className="mt-1.5 text-[11px] leading-5 text-gray-600 dark:text-gray-300">
      {value || "—"}
    </p>
  </div>
);

export default TreatmentReport;