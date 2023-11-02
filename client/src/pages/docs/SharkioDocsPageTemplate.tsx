import React from "react";
import { routes } from "../../constants/routes";
import { TfiSettings } from "react-icons/tfi";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { SharkioDocsNavigation } from "./SharkioDocsNavigation";

type SharkioDocsPageTemplateProps = {
  title: string;
  subTitle: string;
  children: React.ReactNode;
};
export const SharkioDocsPageTemplate = ({
  children,
  title,
  subTitle,
}: SharkioDocsPageTemplateProps) => {
  const navigationItems = [
    {
      title: "Getting Started",
      path: routes.DOCS_GETTINGS_STARTED,
      icon: <TfiSettings className="w-6 h-6 mr-2" />,
    },
    {
      title: "Setup",
      path: routes.DOCS_SETUP,
      icon: <AiOutlinePlayCircle className="w-6 h-6 mr-2" />,
    },
  ];

  return (
    <div className="flex flex-1 flex-row">
      <SharkioDocsNavigation navigationItems={navigationItems} />
      <div className="p-4 flex flex-col flex-1 ">
        <div className="flex text-4xl font-serif ">{title}</div>
        <div className="flex w-full border-b border-border-color my-6"></div>
        <div className="text-lg font-serif mb-4 text-[#717171]">{subTitle}</div>

        <div className="flex flex-col flex-1 p-4">{children}</div>
      </div>
    </div>
  );
};
