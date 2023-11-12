type RuleType = "status_code" | "body" | "header";
type RuleComparator = "equals";
export type Rule = {
  type: RuleType;
  comparator: RuleComparator;
  targetPath: string;
  expectedValue: any;
};
