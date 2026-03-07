import {styled} from "@mui/material"
import {Suspense, useEffect, useState} from "react";
import {TimeInput} from "./components/TimeInput.tsx";
import type {TimeRequest} from "./components/TimeInput.types.ts";
import {createSuspender, type ISuspender} from "./lib/suspense.ts";
import type {ModelData} from "./components/Model.types.ts";
import {Model} from "./components/Model.tsx";

const Content = styled('div')`
    display: flex;
    width: 100%;
    max-height: 100vh;
    max-width: 90vw;
    gap: 30px;
    margin-left: 5%;
    margin-right: 5%;

    @media screen and (max-width: 1080px) {
        margin: 0 2% 0 2%;
    }
`

export const App = () => {
    const [timeData, setTimeData] = useState<TimeRequest | null>(null)
    const [modelPromise, setModelPromise] = useState<ISuspender<ModelData | null> | null>(null)

    useEffect(() => {
        setModelPromise(createSuspender(fetchModel()))
    }, [timeData]);

    const updateTimeData = (args: TimeRequest) => {
        setTimeData(args)
    }

    const fetchModel = async () => {
        if (timeData == null) {
            return null
        }

        const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            body: JSON.stringify(timeData),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const j = await res.json();
        return j as ModelData
    }

    return <Content>
        <TimeInput callback={updateTimeData} />
        <Suspense>
            <Model promise={modelPromise} />
        </Suspense>
    </Content>
}