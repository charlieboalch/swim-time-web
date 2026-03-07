export interface TimeInputProps {
    callback: (args: TimeRequest) => void
}

export interface TimeRequest {
    times: number[],
    target: number | null
    params: Hyperparams
}

export interface Hyperparams {
    delta: number,
    champ_p: number,
    dual_p: number
}