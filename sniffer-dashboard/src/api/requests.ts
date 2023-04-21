import { Invocation } from "@/types/types";

export async function execute(body: Invocation) {
  await fetch("/api/execute", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
