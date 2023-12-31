import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface ILoadingIcon {
  className?: string;
}
export const LoadingIcon: React.FC<ILoadingIcon> = ({ className }) => {
  return (
    <AiOutlineLoading3Quarters
      className={`${className} animate-spin h-4 w-4 `}
    />
  );
};
