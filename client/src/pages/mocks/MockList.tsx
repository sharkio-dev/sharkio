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
      <div className="flex flex-col w-full overflow-y-auto">
        <div
          className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md
  ${isNew ? "bg-primary" : ""}`}
          onClick={() => {
            let params = new URLSearchParams();
            params.append("isNew", "true");
            params.append("snifferId", snifferId?.toString() || "");
            let queryString = params.toString();
            navigator(`/mocks?${queryString}`);
          }}
        >
          <div
            className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
          >
            <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1 mr-4" />
            New
          </div>
        </div>
        {mocks.map((mock) => (
          <div
            className={`flex flex-row w-full  items-center rounded-md space-x-4 justify-between hover:bg-primary cursor-pointer active:bg-tertiary
    ${mock.id === mockId ? "bg-primary" : ""}`}
          >
            <div
              className="flex flex-row items-center space-x-2  w-full"
              onClick={() => {
                let params = new URLSearchParams();
                params.append("snifferId", snifferId?.toString() || "");
                navigator(`/mocks/${mock.id}?${params.toString()}`);
              }}
            >
              {selectIconByMethod(mock.method)}
              <div className="flex text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                {mock.url}
              </div>
            </div>
            <Switch
              checked={mock.isActive}
              size="small"
              onChange={(e) => {
                e.stopPropagation();
                onSwitchChange(mock.id, e.target.checked);
              }}
            ></Switch>
          </div>
        ))}
      </div>
    </>
  );
};
