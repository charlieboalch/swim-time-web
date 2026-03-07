import type {ModelProps} from "./Model.types.ts";
import {ContentContainer} from "../lib/styled.tsx";
import {styled, Typography} from "@mui/material";
import {secondsToMinutes} from "../lib/convert.ts";

const BaseContainer = styled(ContentContainer)`
    flex: 2;
    flex-direction: column;
`

const ContentColumn = styled('div')`
    display: flex;
    justify-content: space-evenly;
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


export const Model = ({promise}: ModelProps) => {
    if (promise == null) {
        return <BaseContainer>hello</BaseContainer>
    }

    const data = promise.read();

    if (data == null) {
        return <BaseContainer>hello</BaseContainer>
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
            <img width={256} src={"data:image/png;base64,"+data.dist}/>
            <img width={256} src={"data:image/png;base64,"+data.res}/>
            <img width={256} src={"data:image/png;base64,"+data.trace}/>
        </ImageGrid>
    </BaseContainer>
}