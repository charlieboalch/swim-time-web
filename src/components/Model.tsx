import type {ModelProps} from "./Model.types.ts";
import {ContentContainer} from "../lib/styled.tsx";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, styled, Typography} from "@mui/material";
import {secondsToMinutes} from "../lib/convert.ts";
import {useState} from "react";

const BaseContainer = styled(ContentContainer)`
    flex: 2;
    flex-direction: column;
    margin-top: -15px;
`

const ContentColumn = styled('div')`
    display: flex;
    justify-content: space-evenly;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
`

const MeetTitle = styled(Typography)`
    text-align: center;
`

const ImageGrid = styled('div')`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
    gap: 10px;
    padding: 20px;
`

const chartDescriptions = {
    "dist": "This shows the calculated distribution of predicted times (logarithmic scale). The red distribution is predicted for championship swims, and the blue distribution is predicted for dual meets. A wider peak means that the model is less confident in its predicted time.",
    "res": "The residuals show systemic over/underprediction of the model. It's probable that your model will have negative residuals at lower values and positive residuals at higher ones. This means the model predicts more conservatively to your mean time. It is unlikely for the model to predict a major outlier as your time, meaning that with training you can beat expectations.",
    "trace": "These distributions show the posterior of the model after running a MCMC simulation. Theta is your predicted \"real\" time, delta is the percent drop observed between championship and dual meets, sigma is the variation between meets, and p is the probability of a meet being a championship."
}

interface ChartProps {
    image: string,
    width: number,
    description: string | undefined
}

const Chart = ({image, width, description}: ChartProps) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <>
        <img onClick={handleOpen} width={width} src={"data:image/png;base64,"+image}/>
        <Dialog open={open} onClose={handleClose} scroll={'paper'}>
            <DialogContent>
                <img width={width * 2} src={"data:image/png;base64,"+image}/>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Dismiss</Button>
            </DialogActions>
        </Dialog>
    </>
}


export const Model = ({promise}: ModelProps) => {
    if (promise == null) {
        return <BaseContainer>Waiting for times...</BaseContainer>
    }

    const data = promise.read();

    if (data == null) {
        return <BaseContainer>Waiting for times...</BaseContainer>
    }

    const targets = (data.championship.target != -1) ? [
        <Typography variant={'body1'}>{data.championship.target.toFixed(0)}% chance to go faster than target</Typography>,
        <Typography variant={'body1'}>{data.dual.target.toFixed(0)}% chance to go faster than target</Typography>
    ] : [<div></div>, <div></div>]

    return <BaseContainer>
        <ContentColumn>
            <div>
                <MeetTitle variant={'h5'}>Tapered Meet</MeetTitle>
                <Typography variant={'body1'}>Expected time: {secondsToMinutes(data.championship.q50)}</Typography>
                <Typography variant={'body1'}>25% chance to go faster than {secondsToMinutes(data.championship.q25)}</Typography>
                <Typography variant={'body1'}>75% chance to go faster than {secondsToMinutes(data.championship.q75)}</Typography>
                {targets[0]}
                <Typography variant={'body1'}>95% confidence interval: [{secondsToMinutes(data.championship["q2.5"])}, {secondsToMinutes(data.championship["q97.5"])}]</Typography>
            </div>
            <div>
                <MeetTitle variant={'h5'}>Dual Meet</MeetTitle>
                <Typography variant={'body1'}>Expected time: {secondsToMinutes(data.dual.q50)}</Typography>
                <Typography variant={'body1'}>25% chance to go faster than {secondsToMinutes(data.dual.q25)}</Typography>
                <Typography variant={'body1'}>75% chance to go faster than {secondsToMinutes(data.dual.q75)}</Typography>
                {targets[1]}
                <Typography variant={'body1'}>95% confidence interval: [{secondsToMinutes(data.dual["q2.5"])}, {secondsToMinutes(data.dual["q97.5"])}]</Typography>
            </div>
        </ContentColumn>
        <ImageGrid>
            <Chart width={256} image={data.dist} description={chartDescriptions['dist']}/>
            <Chart width={256} image={data.res} description={chartDescriptions['res']}/>
            <Chart width={256} image={data.trace} description={chartDescriptions['trace']}/>
        </ImageGrid>
    </BaseContainer>
}