import type { ScoreTool, ScoreVariable } from "@/lib/types";

export type PublicScoreVariable = Omit<ScoreVariable, "scale" | "hideWhen">;
export type PublicScoreTool = Omit<ScoreTool, "compute" | "variables"> & {
  variables: PublicScoreVariable[];
};
