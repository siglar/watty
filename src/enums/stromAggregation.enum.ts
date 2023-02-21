const stromAggregationArray = ['Hour', 'Day'] as const;
export type StromAggregationEnum = typeof stromAggregationArray[number];
