import type { ScoreTool, ScoreVariable } from "@/lib/types";

export type PublicScoreVariable = Omit<ScoreVariable, "scale" | "hideWhen">;
export type PublicScoreTool = Omit<ScoreTool, "compute" | "variables"> & {
  variables: PublicScoreVariable[];
  requiresServerCalculation: boolean;
};

export function requiresServerScoreCalculation(tool: Pick<ScoreTool, "compute" | "variables">): boolean {
  return Boolean(tool.compute || tool.variables.some((variable) => variable.scale || variable.hideWhen));
}
