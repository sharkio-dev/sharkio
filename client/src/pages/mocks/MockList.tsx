import { Switch } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMockStore } from "../../stores/mockStore";
import { AiOutlinePlus } from "react-icons/ai";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import queryString from "query-string";

export const MockList = () => {
  const { mocks, activateMock, deactivateMock } = useMockStore();
  const { mockId } = useParams();
  const navigator = useNavigate();
  const location = useLocation();
  const { isNew, snifferId } = queryString.parse(location.search);

  const onSwitchChange = (mockId: string, isActive: boolean) => {
    if (!snifferId) return;
    if (isActive) {
      activateMock(snifferId as string, mockId);
    } else {
      deactivateMock(snifferId as string, mockId);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full ">
        <div className="border-b border-border-color pb-2 mb-2">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md
  ${isNew ? "bg-primary" : ""}`}
            onClick={() => {
              navigator(`/mocks?isNew=true&snifferId=${snifferId}`);
            }}
          >
            <div
              className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
            >
              <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1 mr-4" />
              New Mock
            </div>
          </div>
        </div>
        {mocks.map((mock) => (
          <div
            className={`flex flex-row w-full items-center rounded-md space-x-4 hover:bg-primary cursor-pointer active:bg-tertiary
    ${mock.id === mockId ? "bg-primary" : ""}`}
          >
            <div
              className="flex flex-row items-center space-x-2  w-full"
              onClick={() => {
                navigator(`/mocks/${mock.id}?snifferId=${snifferId}`);
              }}
            >
              {selectIconByMethod(mock.method)}
              <div className="flex w-full text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                {mock.url}
              </div>
              <Switch
                checked={mock.isActive}
                size="small"
                onChange={(e) => {
                  e.stopPropagation();
                  onSwitchChange(mock.id, e.target.checked);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
