import React from "react";
import { a11yDark, CopyBlock } from "react-code-blocks";
import { SharkioDocsPageTemplate } from "./SharkioDocsPageTemplate";
import { SharkioDocsSection } from "./SharkioDocsSection";

export const SharkioDocsSetupPage = () => {
  return (
    <SharkioDocsPageTemplate
      title={"Setup Guide"}
      subTitle={
        "Learn how to set up Sharkio and start using it to develop your APIs."
      }
    >
      <SharkioDocsSection title="Sign Up" sectionNumber={1}>
        Head to the{" "}
        <a href="https://sharkio.dev" className="hover:text-blue-200">
          Sharkio website.
        </a>
        <img
          src="/login.png"
          alt=""
          className="w-full rounded-lg h-96 border-2 border-border-color mt-4"
        />
      </SharkioDocsSection>

      <SharkioDocsSection title="Generate an API Token" sectionNumber={2}>
        <p>
          Access the{" "}
          <a
            href="https://sharkio.dev/api-keys"
            className="hover:text-blue-200"
          >
            API Keys page
          </a>{" "}
          by clicking on your profile picture and generate a token.
        </p>
        <img
          src="/apiKeys.png"
          alt=""
          className="w-full rounded-lg h-96 border-2 border-border-color mt-4"
        />
      </SharkioDocsSection>

      <SharkioDocsSection title="Install Sharkio-cli" sectionNumber={3}>
        Install the Sharkio-cli.
        <div className="flex flex-col w-full mt-2">
          <CopyBlock
            language="bash"
            text={`npm i -g sharkio-cli`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLines={true}
            codeBlock
          />
        </div>
      </SharkioDocsSection>

      <SharkioDocsSection title="Sharkio Login" sectionNumber={4}>
        Login to Sharkio-cli, the session will be saved in your home folder.
        <div className="flex flex-col w-full my-2">
          <CopyBlock
            language="bash"
            text={`sharkio login`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLines={true}
            codeBlock
          />
        </div>
        {"You'll"} be prompted to enter your email and the precious token{" "}
        {"you've "}secured.
      </SharkioDocsSection>
    </SharkioDocsPageTemplate>
  );
};
