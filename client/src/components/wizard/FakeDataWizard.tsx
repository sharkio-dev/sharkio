import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { WizardItem } from "./WizardItem";
import { WizardTemplate } from "./WizardTemplate";
import {
  COMMENTS_TEMPLATE,
  POSTS_TEMPLATE,
  USERS_TEMPLATE,
  ADDRESSES_TEMPLATE,
  LIKES_TEMPLATE,
  FOLLOWERS_TEMPLATE,
  TODOS_TEMPLATE,
  ALBUMS_TEMPLATE,
  PHOTOS_TEMPLATE,
  CATEGORIES_TEMPLATE,
  PRODUCTS_TEMPLATE,
} from "./templates";

interface FakeDataWizardProps {
  handleSelection: (text: string) => void;
  onClose: () => void;
  goBack?: () => void;
}
export const FakeDataWizard: React.FC<FakeDataWizardProps> = ({
  handleSelection,
  onClose,
  goBack,
}) => {
  const initEntries = () => {
    return Object.entries(faker).filter(
      ([key, _]) => !key.startsWith("_") && !key.startsWith("faker"),
    );
  };
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>(initEntries());
  const [subEntries, setSubEntries] = useState<any[]>([]);

  const onEntryClick = (key: string, value: any) => {
    setSubEntries(
      Object.entries(value).filter(
        ([key, _]) => !key.startsWith("_") && !key.startsWith("faker"),
      ),
    );
    setSelectedEntry(key);
  };
  const reset = () => {
    setEntries(initEntries());
    setSelectedEntry(null);
    setSubEntries([]);
  };

  const onSubEntryClick = (key: string) => {
    handleSelection(`{{faker "${selectedEntry}.${key}"}}`);
    onClose();
    reset();
  };

  return (
    <>
      {subEntries.length === 0 && (
        <WizardTemplate onClose={onClose} title="Fake Data" goBack={goBack}>
          {entries.map(([key, value]) => (
            <WizardItem
              key={key}
              title={key}
              onClick={() => {
                onEntryClick(key, value);
              }}
            />
          ))}
        </WizardTemplate>
      )}
      {subEntries.length > 0 && (
        <WizardTemplate
          onClose={() => {
            setSubEntries([]);
          }}
          title={selectedEntry}
          goBack={() => {
            setSelectedEntry(null);
            setSubEntries([]);
          }}
        >
          {subEntries.map(([key, _]) => (
            <WizardItem
              key={key}
              title={key}
              onClick={() => {
                onSubEntryClick(key);
              }}
            />
          ))}
        </WizardTemplate>
      )}
    </>
  );
};

export const TemplateWizard: React.FC<FakeDataWizardProps> = ({
  handleSelection,
  onClose,
  goBack,
}) => {
  return (
    <WizardTemplate onClose={onClose} title="Templates" goBack={goBack}>
      <WizardItem
        title="Users"
        onClick={() => {
          handleSelection(USERS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Posts"
        onClick={() => {
          handleSelection(POSTS_TEMPLATE);
          onClose();
        }}
      />

      <WizardItem
        title="Comments"
        onClick={() => {
          handleSelection(COMMENTS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Addresses"
        onClick={() => {
          handleSelection(ADDRESSES_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Likes"
        onClick={() => {
          handleSelection(LIKES_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Followers"
        onClick={() => {
          handleSelection(FOLLOWERS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Todos"
        onClick={() => {
          handleSelection(TODOS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Albums"
        onClick={() => {
          handleSelection(ALBUMS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Photos"
        onClick={() => {
          handleSelection(PHOTOS_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Categories"
        onClick={() => {
          handleSelection(CATEGORIES_TEMPLATE);
          onClose();
        }}
      />
      <WizardItem
        title="Products"
        onClick={() => {
          handleSelection(PRODUCTS_TEMPLATE);
          onClose();
        }}
      />
    </WizardTemplate>
  );
};

export const RequestDataWizard: React.FC<FakeDataWizardProps> = ({
  handleSelection,
  onClose,
  goBack,
}) => {
  return (
    <WizardTemplate onClose={onClose} title="Request Data" goBack={goBack}>
      <WizardItem
        title="Request Headers"
        onClick={() => {
          handleSelection(`{{headers["header-name"]}}`);
          onClose();
        }}
      />
      <WizardItem
        title="Request Body"
        onClick={() => {
          handleSelection(`{{body["body-property"]}}`);
          onClose();
        }}
      />
      <WizardItem
        title="Request Params"
        onClick={() => {
          handleSelection(`{{params["param-name"]}}`);
          onClose();
        }}
      />
    </WizardTemplate>
  );
};
