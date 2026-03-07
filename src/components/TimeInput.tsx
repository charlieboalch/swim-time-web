import {Button, Slider, styled, TextField, Typography} from "@mui/material";
import {useState} from "react";
import type {Hyperparams, TimeInputProps, TimeRequest} from "./TimeInput.types.ts";
import {ContentContainer} from "../lib/styled.tsx";
import {minutesToSeconds} from "../lib/convert.ts";

const TimeContainer = styled(ContentContainer)`
    @media screen and (max-width: 1080px) {
        flex-direction: column-reverse;
    }
`

const TimesInput = styled(TextField)`
    display: flex;
    flex: 1;
`

const ParamsInput = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: min-content;
    justify-content: space-between;
    flex: 1;
`

const meetRatios = {
    1: {
        dual: 6,
        championship: 2
    },
    2: {
        dual: 4,
        championship: 2
    },
    3: {
        dual: 2,
        championship: 2
    },
    4: {
        dual: 2,
        championship: 4
    },
    5: {
        dual: 2,
        championship: 6
    }
}

export const TimeInput = ({callback}: TimeInputProps) => {
    const [times, setTimes] = useState('')
    const [delta, setDelta] = useState(0.03)
    const [ratio, setRatio] = useState(3)
    const [target, setTarget] = useState('')

    const makeRequest = () => {
        const parsedRatio = meetRatios[ratio as keyof typeof meetRatios];

        const hyperparams: Hyperparams = {
            delta: delta,
            champ_p: parsedRatio['championship'],
            dual_p: parsedRatio['dual']
        }

        const request: TimeRequest = {
            times: times.split("\n").map(e => minutesToSeconds(e)),
            target: (target != '') ? Number(target.trim()) : null,
            params: hyperparams
        }

        callback(request)
    }

    return <TimeContainer>
        <TimesInput value={times}
                    onChange={(e) =>
                        setTimes(e.target.value)}
                    label={"Swim Times"}
                    multiline={true}
                    minRows={10} />
        <ParamsInput>
            <Typography variant={'body1'}>Tech suit time drop: {Math.trunc(delta * 100)}%</Typography>
            <Slider
                defaultValue={0.03}
                step={0.01}
                min={0.01}
                max={0.1}
                marks={true}
                value={delta}
                onChange={(_, newValue) => setDelta(newValue)}/>
            <Typography variant={'body1'}>Meet Ratio</Typography>
            <Slider
                defaultValue={3}
                step={1}
                min={1}
                max={5}
                track={false}
                marks={[
                    {
                        value: 1,
                        label: "More dual"
                    },
                    {value: 2},
                    {value: 3},
                    {value: 4},
                    {
                        value: 5,
                        label: "More championship"
                    }
                ]}
                sx={{
                    "& .MuiSlider-markLabel[data-index='0']": {
                        transform: "translateX(0)"
                    },
                    "& .MuiSlider-markLabel[data-index='4']": {
                        transform: "translateX(-100%)"
                    }
                }}
                value={ratio}
                onChange={(_, newValue) => setRatio(newValue)}/>
            <TextField placeholder={"Target time (optional)"}
                       value={target}
                       onChange={(e) => setTarget(e.target.value)} />
            <br/>
            <Button onClick={makeRequest} variant={'contained'}>Predict</Button>
        </ParamsInput>
    </TimeContainer>
}