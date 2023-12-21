type RuleType = "status_code" | "body" | "header";
type RuleComparator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "gt"
  | "lt"
  | "gte"
  | "lte";
export type Rule = {
  type: RuleType;
  comparator: RuleComparator;
  targetPath: string;
  expectedValue: any;
};
