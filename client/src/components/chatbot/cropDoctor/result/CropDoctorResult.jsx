import {
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import CropDoctorResultHeader from "./CropDoctorResultHeader";
import CropDoctorOverview from "./CropDoctorOverview";
import CropDoctorConditions from "./CropDoctorConditions";
import CropDoctorListSection from "./CropDoctorListSection";
import CropDoctorExpertHelp from "./CropDoctorExpertHelp";
import {
  getCropDoctorText,
} from "../cropDoctorTranslations";

import TreatmentReportButton from "../treatmentReport/TreatmentReportButton";
import TreatmentReport from "../treatmentReport/TreatmentReport";

const CropDoctorResult = ({
  analysis,
  onNewAnalysis,
  speaking = false,
  onSpeak,
  onStopSpeaking,
  language = "en-IN",
  treatmentReport = null,
  reportGenerating = false,
  onGenerateTreatmentReport,
  sourceImages = [],
}) => {
  if (!analysis) {
    return null;
  }

  const text =
    getCropDoctorText(language);

  const conditions =
    analysis.possible_conditions ||
    [];

  const speechText = [
    analysis.summary,

    ...conditions.map(
      (condition) =>
        `${condition.common_name || condition.name || ""}. ${
          condition.local_name || ""
        }. ${
          condition.scientific_name || ""
        }. ${
          condition.reason || ""
        }`,
    ),

    ...(analysis.immediate_actions ||
      []),

    ...(analysis.treatment_guidance ||
      []),

    ...(analysis.prevention ||
      []),

    analysis.expert_help,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div className="space-y-4 pb-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white/90 shadow-sm dark:border-emerald-900/50 dark:bg-gray-900/90">
        <CropDoctorResultHeader
          text={text}
          speaking={speaking}
          speechText={speechText}
          onSpeak={onSpeak}
          onStopSpeaking={
            onStopSpeaking
          }
          onNewAnalysis={
            onNewAnalysis
          }
        />

        <CropDoctorOverview
          analysis={analysis}
          text={text}
          conditionsCount={
            conditions.length
          }
        />
      </div>

      <CropDoctorListSection
        title={text.observations}
        items={analysis.observations}
        icon={
          <span
            aria-hidden="true"
            className="text-blue-500"
          >
            ●
          </span>
        }
      />

      <CropDoctorConditions
        conditions={conditions}
        text={text}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <CropDoctorListSection
          title={text.immediate}
          items={
            analysis.immediate_actions
          }
          icon={
            <CheckCircle2
              size={16}
              className="text-emerald-500"
              aria-hidden="true"
            />
          }
        />

        <CropDoctorListSection
          title={text.treatment}
          items={
            analysis.treatment_guidance
          }
          icon={
            <Stethoscope
              size={16}
              className="text-green-500"
              aria-hidden="true"
            />
          }
        />
      </div>

      <CropDoctorListSection
        title={text.prevention}
        items={analysis.prevention}
        icon={
          <ShieldCheck
            size={16}
            className="text-teal-500"
            aria-hidden="true"
          />
        }
      />

      <CropDoctorExpertHelp
        expertHelp={
          analysis.expert_help
        }
        disclaimer={
          analysis.disclaimer
        }
        fallback={text.fallback}
        title={text.expert}
      />

      {!treatmentReport && (
        <TreatmentReportButton
          onGenerate={
            onGenerateTreatmentReport
          }
          loading={
            reportGenerating
          }
          language={language}
        />
      )}

      {treatmentReport && (
        <TreatmentReport
          report={treatmentReport}
          sourceImages={
            sourceImages
          }
          language={language}
        />
      )}
    </div>
  );
};

export default CropDoctorResult;