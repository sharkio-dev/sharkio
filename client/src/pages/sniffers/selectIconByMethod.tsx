import {
  TbHttpDelete,
  TbHttpGet,
  TbHttpHead,
  TbHttpOptions,
  TbHttpPatch,
  TbHttpPost,
  TbHttpPut,
} from "react-icons/tb";

export const selectIconByMethod = (method: string) => {
  switch (method) {
    case "GET":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpGet className="text-green-500 w-[24px] h-[24px]" />
        </div>
      );
    case "POST":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpPost className="text-blue-500 w-[24px] h-[24px]" />
        </div>
      );
    case "PUT":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpPut className="text-yellow-500 w-[24px] h-[24px]" />
        </div>
      );
    case "DELETE":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpDelete className="text-red-500 w-[24px] h-[24px]" />
        </div>
      );
    case "PATCH":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpPatch className="text-purple-500 w-[24px] h-[24px]" />
        </div>
      );
    case "HEAD":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpHead className="text-gray-500 w-[24px] h-[24px]" />
        </div>
      );
    case "OPTIONS":
      return (
        <div className="w-[24px] h-[24px]">
          <TbHttpOptions className="text-gray-500 w-[24px] h-[24px]" />
        </div>
      );
    default:
      return <div className="w-[24px] h-[24px]"></div>;
  }
};
