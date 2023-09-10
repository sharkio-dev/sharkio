import { Button, Card } from "@mui/material";
import { ReactElement } from "react";

const PricingCard: React.FC<{
  title: string;
  texts: ReactElement;
  buttonText: string;
  price: string;
}> = ({ texts, title, buttonText, price }) => {
  return (
    <Card className="max-w-xs rounded h-fit">
      <div className="px-8 py-8">
        <span className="block mb-8 text-xl">{title}</span>
        <div className="flex flex-col gap-2 text-gray-400">{texts}</div>
      </div>
      <div className="flex flex-col justify-center items-center  mb-10 gap-2 text-xl">
        <div>{price}</div>
        <div className="text-sm">member / month</div>
      </div>
      <div className="flex items-center justify-center w-full px-4 pb-10">
        <Button variant="contained" className="w-full">
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export const Pricing = () => {
  return (
    <>
      <div className="flex flex-row lg:gap-10 md:gap-2 sm:gap-2 lg:px-20 justify-center items-center pt-20">
        <PricingCard
          title="Free"
          buttonText={"Try now"}
          price="0$"
          texts={
            <>
              <span>✓ Unlimited Requests</span>
              <span>3 Collections</span>
              <span>5 Proxies</span>
              <span>10 Api mocks</span>
              <span>1 Member</span>
            </>
          }
        />
        <PricingCard
          title="Basic"
          buttonText={"Upcoming..."}
          price="20$"
          texts={
            <>
              <span>✓ Unlimited Requests</span>
              <span>✓ Unlimited Collections</span>
              <span>✓ Unlimited Proxies</span>
              <span>✓ Unlimited Api mocks</span>
              <span>3 Free members</span>
              <span>10 members</span>
            </>
          }
        />
        <PricingCard
          title="Business"
          buttonText={"Upcoming..."}
          price="$"
          texts={
            <>
              <span>✓ Unlimited Requests</span>
              <span>✓ Unlimited Collections</span>
              <span>✓ Unlimited Proxies</span>
              <span>✓ Unlimited Api mocks</span>
              <span>✓ Unlimited members</span>
            </>
          }
        />
      </div>
    </>
  );
};
