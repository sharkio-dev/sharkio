import React from "react";

type SharkioDocsSectionProps = {
  title: string;
  children: React.ReactNode;
  sectionNumber?: number;
};
export const SharkioDocsSection = ({
  title,
  children,
  sectionNumber,
}: SharkioDocsSectionProps) => {
  return (
    <section className="flex flex-col mb-8">
      <div className="flex w-full flex-row mb-2">
        <div className="flex text font-serif bg-blue-200 px-2 rounded-lg border-blue-200 border-2 bg-opacity-40 mr-4">
          {sectionNumber ? `${sectionNumber}` : 1}
        </div>
        <div className="text-xl font-bold whitespace-pre-line">{title}</div>
      </div>
      <div className="text-lg font-serif mb-4 text-[#717171] whitespace-pre-line">
        {children}
      </div>
    </section>
  );
};
