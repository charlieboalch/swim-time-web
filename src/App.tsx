import {
    AppBar,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Fab,
    IconButton,
    styled,
    Toolbar,
    Typography
} from "@mui/material"
import {type ReactNode, Suspense, useEffect, useState} from "react";
import {TimeInput} from "./components/TimeInput.tsx";
import type {TimeRequest} from "./components/TimeInput.types.ts";
import {createSuspender, type ISuspender} from "./lib/suspense.ts";
import type {ModelData} from "./components/Model.types.ts";
import {Model} from "./components/Model.tsx";
import {ContentContainer} from "./lib/styled.tsx";
import {GrCircleQuestion, GrTime} from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import {getWindowSize} from "./lib/hooks.tsx";
import {getApi} from "./lib/environment.ts";

const Content = styled('div')`
    display: flex;
    width: 100%;
    max-height: 100vh;
    max-width: 90vw;
    gap: 30px;
    margin-left: 5%;
    margin-right: 5%;
    flex-direction: row;

    @media screen and (max-width: 1080px) {
        margin: 0 2% 0 2%;
    }

    @media screen and (max-width: 768px) {
        flex-direction: column;
    }
`

const Header = styled('div')`
    min-height: 6vh;
    width: 90%;
    display: flex;
    padding: 10px 5% 20px;
    justify-content: space-between;
    align-content: center;
`

const Loading = () => {
    return <ContentContainer style={{justifyContent: "center", flex: 2}}>
        <CircularProgress />
    </ContentContainer>
}

const HelpMenu = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <>
        <Button onClick={handleOpen} style={{padding: 0, margin: 0}}>
            <GrCircleQuestion size={20} />
        </Button>
        <Dialog open={open} onClose={handleClose} scroll={'paper'}>
            <DialogContent>
                <DialogContentText>
                    To use: put in a list of your previous times in any event and adjust the parameters to fine-tune the model's estimate of how you performed. Find your times off of any platform - MeetMobile, SwimCloud, CCS, etc. I recommend using at least 10 times over the past year, and having more times will result in a more accurate prediction.
                    <br/> <br/>
                    This tool works by building a Bayesian prediction model. It uses the sliders to create an initial prior distribution, and your samples as observations to generate a posterior distribution of likely times.
                    <br/> <br/>
                    Created for UGA Club Swim.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Dismiss</Button>
            </DialogActions>
        </Dialog>
    </>
}

export const App = () => {
    const [timeData, setTimeData] = useState<TimeRequest | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [modelPromise, setModelPromise] = useState<ISuspender<ModelData | null> | null>(null)
    const windowSize = getWindowSize()

    useEffect(() => {
        setModelPromise(createSuspender(fetchModel()))
    }, [timeData]);

    const updateTimeData = (args: TimeRequest) => {
        setTimeData(args)
        setOpenDialog(false)
    }

    const fetchModel = async () => {
        if (timeData == null) {
            return null
        }

        if (timeData.times.length <= 1) {
            return null
        }

        const res = await fetch(getApi(), {
            method: "POST",
            body: JSON.stringify(timeData),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const j = await res.json();
        return j as ModelData
    }

    const input =(windowSize[0] <= 768) ? <InputDialog
        open={openDialog}
        handleOpen={() => setOpenDialog(true)}
        handleClose={() => setOpenDialog(false)}>
        <TimeInput callback={updateTimeData} />
    </InputDialog> : <TimeInput callback={updateTimeData} />

    return <>
        <Header>
            <Typography variant={'h5'} sx={{display: 'flex', alignItems: 'center'}}>Time Predictor</Typography>
            <HelpMenu />
        </Header>
        <Content>
            {input}
            <Suspense fallback={<Loading />}>
                <Model promise={modelPromise} />
            </Suspense>
        </Content>
    </>
}

interface InputDialogProps {
    children: ReactNode,
    open: boolean,
    handleOpen: () => void,
    handleClose: () => void
}

const InputDialog = ({ children, open, handleOpen, handleClose }: InputDialogProps) => {
    return <>
        <Fab color={'primary'} style={{position: 'fixed', bottom: 40, right: 40}} onClick={() => handleOpen()}>
            <GrTime />
        </Fab>
        <Dialog fullScreen open={open} onClose={handleClose}>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={handleClose}>
                        <IoMdClose color={'white'} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    </>
}