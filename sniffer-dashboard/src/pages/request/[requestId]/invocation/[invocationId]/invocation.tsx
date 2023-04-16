import { useRouter } from "next/router";

export const Invocation = () => {
  const router = useRouter();
  const data = router.query;

  return <>{JSON.stringify(data, null, 2)}</>;
};
