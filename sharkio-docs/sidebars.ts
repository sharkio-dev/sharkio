import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure

  // But you can create a sidebar manually

  tutorialSidebar: [
    "Getting Started",
    "Use Cases",
    {
      type: "category",
      label: "Proxing",
      items: [
        "Proxing/101",
        "Proxing/Proxy to a local server",
        "Proxing/Proxy to a remote server",
      ],
    },
    {
      type: "category",
      label: "Debugging",
      items: ["Debugging/101"],
    },
    {
      type: "category",
      label: "Mocking",
      items: ["Mocking/101"],
    },
    {
      type: "category",
      label: "Testing",
      items: ["Testing/101"],
    },
    {
      type: "category",
      label: "Docs",
      items: ["Docs/101"],
    },
  ],
};

export default sidebars;
