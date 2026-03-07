import type {ISuspender} from "../lib/suspense.ts";

export interface ModelProps {
    promise: ISuspender<ModelData | null> | null
}

export interface ModelData {
    championship: TimePercentiles,
    dual: TimePercentiles,
    dist: string,
    res: string,
    trace: string
}

export interface TimePercentiles {
    'q2.5': number,
    'q25': number,
    'q50': number,
    'q75': number,
    'q97.5': number,
    target: number
}