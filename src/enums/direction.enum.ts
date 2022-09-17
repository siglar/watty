const readonlyDirections = ["before", "after"] as const;
export type Direction = typeof readonlyDirections[number];
