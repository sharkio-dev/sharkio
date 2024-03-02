import { faker } from "@faker-js/faker";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingIcon } from "../../pages/sniffers/LoadingIcon";
import { NodeType, getNodes } from "../../stores/flowStore";
import { WizardItem } from "./WizardItem";
import { WizardTemplate } from "./WizardTemplate";
import {
  ADDRESSES_TEMPLATE,
  ALBUMS_TEMPLATE,
  CATEGORIES_TEMPLATE,
  COMMENTS_TEMPLATE,
  FOLLOWERS_TEMPLATE,
  LIKES_TEMPLATE,
  PHOTOS_TEMPLATE,
  POSTS_TEMPLATE,
  PRODUCTS_TEMPLATE,
  TODOS_TEMPLATE,
  USERS_TEMPLATE,
} from "./templates";
import { SearchBar } from "../../components/search/SearchBar";

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

  const handleSearch = (searchTerm: string) => {
    const allEntries = initEntries();
    const filteredEntries = filterEntries(allEntries, searchTerm);
    setEntries(filteredEntries);
  };

  const filterEntries = (data: [string, Object][], searchTerm: string) => {
    let filteredEntries = [];

    const doesSubEntryMatch = (subEntries: [string, any][]) => {
      return subEntries.some(([subKey]) =>
        subKey.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    };

    for (const [key, value] of data) {
      const keyMatches = key.toLowerCase().includes(searchTerm.toLowerCase());
      const subEntriesMatches =
        value &&
        typeof value === "object" &&
        doesSubEntryMatch(Object.entries(value));

      if (keyMatches || subEntriesMatches) {
        filteredEntries.push([key, value]);
      }
    }

    return filteredEntries;
  };

  return (
    <>
      {subEntries.length === 0 && (
        <>
          <div className="mt-2">
            <WizardTemplate
              onClose={onClose}
              title="Fake Data"
              goBack={goBack}
              searchComponent={<SearchBar handleSearch={handleSearch} />}
            >
              <div className="h-[300px]">
                {entries.map(([key, value]) => (
                  <WizardItem
                    key={key}
                    title={key}
                    onClick={() => {
                      onEntryClick(key, value);
                    }}
                  />
                ))}
              </div>
            </WizardTemplate>
          </div>
        </>
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

export const PreviousStepsWizard: React.FC<FakeDataWizardProps> = ({
  handleSelection,
  onClose,
  goBack,
}) => {
  const { flowId, testId } = useParams();
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextSelected, setContextSelected] = useState<boolean>(false);
  const [path, setPath] = useState<string[]>([]);

  const loadNodes = (flowId: string) => {
    getNodes(flowId)
      .then((data: any) => {
        setNodes(data.data);
      })
      .catch(() => {
        alert("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!flowId) return;
    setIsLoading(true);
    loadNodes(flowId);
  }, []);

  type wizardNodeItem = {
    title: string;
    template: string;
    onClick?: (item: wizardNodeItem) => void;
  };

  const httpNodeItems: wizardNodeItem[] = [
    {
      title: "Status Code",
      template: `${selectedNode?.id}.response.status`,
    },
    {
      title: "Response Body",
      template: `${selectedNode?.id}.response.body`,
    },
    {
      title: "Response Headers",
      template: `${selectedNode?.id}.response.headers`,
    },
  ];
  const subflowItems: wizardNodeItem[] = [
    {
      title: "steps",
      template: `{{${selectedNode?.id}.context}}`,
      onClick: () => {
        setContextSelected(true);
        setPath([...path, `${selectedNode?.id}.context`]);
        selectedNode?.subFlowId != null && loadNodes(selectedNode?.subFlowId);
      },
    },
    {
      title: "success",
      template: `${selectedNode?.id}.success`,
    },
  ];

  const handleItemClicked = (node: NodeType) => {
    if (node.type === "http") {
      setSelectedNode(node);
    } else if (node.type === "subflow") {
      setSelectedNode(node);
    }
    setContextSelected(false);
  };

  const selectedNodeItems =
    selectedNode?.type === "http" ? httpNodeItems : subflowItems;

  return (
    <>
      <WizardTemplate
        onClose={onClose}
        title="Previous steps responses"
        goBack={goBack}
      >
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <>
            {selectedNode != null && !contextSelected
              ? selectedNodeItems.map((item) => {
                  return (
                    <WizardItem
                      title={item.title}
                      onClick={() => {
                        item.onClick != null
                          ? item.onClick(item)
                          : (() => {
                              const template =
                                "{{" +
                                path.join(".") +
                                (path.length > 0 ? "." : "") +
                                item.template +
                                "}}";
                              handleSelection(template);
                              onClose();
                            })();
                      }}
                    />
                  );
                })
              : nodes
                  .filter((node) => node.id !== testId)
                  .map((node) => {
                    return (
                      <WizardItem
                        title={node.name}
                        onClick={() => {
                          handleItemClicked(node);
                        }}
                      ></WizardItem>
                    );
                  })}
          </>
        )}
      </WizardTemplate>
    </>
  );
};
