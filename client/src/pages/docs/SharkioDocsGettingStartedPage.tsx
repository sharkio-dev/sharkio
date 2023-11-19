import { a11yDark, CopyBlock } from "react-code-blocks";
import { SharkioDocsPageTemplate } from "./SharkioDocsPageTemplate";
import { SharkioDocsSection } from "./SharkioDocsSection";

export const SharkioDocsGettingStartedPage = () => {
  return (
    <SharkioDocsPageTemplate
      title={"Getting Started"}
      subTitle={"Get started with Sharkio in 4 easy steps."}
    >
      <SharkioDocsSection title={"Start Your API"} sectionNumber={1}>
        Start your API service on your local machine.
      </SharkioDocsSection>

      <SharkioDocsSection title="Create a Sniffer" sectionNumber={2}>
        Create a sniffer (=Proxy) to monitor your API traffic by running the
        following command:
        <div className="flex flex-col w-full my-2">
          <CopyBlock
            // @ts-ignore
            language="bash"
            text={`sharkio create sniffer -p <port> -n <name>`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLongLines={true}
            codeBlock
          />
        </div>
        Port: The port your API is running on.{"\n"}
        Name: The name of your sniffer.
        <div className="text-lg font-serif mt-2">
          {"You'll"} be given a unique subdomain for your sniffer. This is where
          you will redirect your traffic to.
        </div>
      </SharkioDocsSection>

      <SharkioDocsSection title="Start Your Sniffer" sectionNumber={3}>
        Start your sniffer by running the following command:
        <div className="flex flex-col w-full my-2">
          <CopyBlock
            // @ts-ignore
            language="bash"
            text={`sharkio start sniffer`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLongLines={true}
            codeBlock
          />
        </div>
      </SharkioDocsSection>

      <SharkioDocsSection
        title="Redirect Other Services to Subdomain"
        sectionNumber={4}
      >
        Redirect your all the services that communicate with your API to the new
        subdomain.{"\n"}
        Now you can open the Sharkio dashboard and start building faster.
      </SharkioDocsSection>
    </SharkioDocsPageTemplate>
  );
};
