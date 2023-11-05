import {
  TbHttpDelete,
  TbHttpGet,
  TbHttpOptions,
  TbHttpPatch,
  TbHttpPost,
  TbHttpPut,
} from "react-icons/tb";

export const selectIconByMethod = (method: string) => {
  switch (method) {
    case "GET":
      return <TbHttpGet className="text-green-500 h-8 w-8 p-1" />;
    case "POST":
      return <TbHttpPost className="text-blue-500 h-8 w-8 p-1" />;
    case "PUT":
      return <TbHttpPut className="text-yellow-500 h-8 w-8 p-1" />;
    case "PATCH":
      return <TbHttpPatch className="text-purple-500 h-8 w-8 p-1" />;
    case "DELETE":
      return <TbHttpDelete className="text-red-500 h-8 w-8 p-1" />;
    case "OPTIONS":
      return <TbHttpOptions className="text-gray-500 h-8 w-8 p-1" />;
    default:
      return;
  }
};
