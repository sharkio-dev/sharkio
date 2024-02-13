import React, { useState } from "react";
import { WizardItem } from "./WizardItem";
import { WizardTemplate } from "./WizardTemplate";
import {
  FakeDataWizard,
  PreviousStepsWizard,
  TemplateWizard,
} from "./FakeDataWizard";

interface WizardMenuProps {
  handleSelection: (text: string) => void;
  onClose: () => void;
  showFakeData?: boolean;
  showTemplates?: boolean;
  showPreviousSteps?: boolean;
  showAi?: boolean;
}
export const WizardMenu: React.FC<WizardMenuProps> = ({
  handleSelection,
  onClose,
  showFakeData = true,
  showTemplates = true,
  showPreviousSteps = true,
  showAi = true,
}) => {
  const [wizardType, setWizardType] = useState("");

  return (
    <>
      {wizardType === "" && (
        <WizardTemplate onClose={onClose} title="Generate Data">
          {showFakeData && (
            <WizardItem
              title="Fake Data"
              onClick={() => setWizardType("fake-data")}
            />
          )}
          {showTemplates && (
            <WizardItem
              title="Templates"
              onClick={() => setWizardType("templates")}
            />
          )}
          {showPreviousSteps && (
            <WizardItem
              title="Previous Steps"
              onClick={() => setWizardType("previous-steps")}
            />
          )}
          {showAi && <WizardItem title="AI ⭒˚" />}
        </WizardTemplate>
      )}
      {wizardType === "fake-data" && (
        <FakeDataWizard
          handleSelection={handleSelection}
          onClose={onClose}
          goBack={() => setWizardType("")}
        />
      )}
      {wizardType === "templates" && (
        <TemplateWizard
          onClose={onClose}
          goBack={() => setWizardType("")}
          handleSelection={handleSelection}
        />
      )}
      {wizardType === "previous-steps" && (
        <PreviousStepsWizard
          onClose={onClose}
          goBack={() => setWizardType("")}
          handleSelection={handleSelection}
        />
      )}
    </>
  );
};
