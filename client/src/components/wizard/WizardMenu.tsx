import React, { useState } from "react";
import { WizardItem } from "./WizardItem";
import { WizardTemplate } from "./WizardTemplate";
import { FakeDataWizard, TemplateWizard } from "./FakeDataWizard";

interface WizardMenuProps {
  handleSelection: (text: string) => void;
  onClose: () => void;
}
export const WizardMenu: React.FC<WizardMenuProps> = ({
  handleSelection,
  onClose,
}) => {
  const [wizardType, setWizardType] = useState("");

  return (
    <>
      {wizardType === "" && (
        <WizardTemplate onClose={onClose} title="Generate Data">
          <WizardItem
            title="Fake Data"
            onClick={() => setWizardType("fake-data")}
          />
          <WizardItem
            title="Templates"
            onClick={() => setWizardType("templates")}
          />
          <WizardItem title="AI ⭒˚" />
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
    </>
  );
};
