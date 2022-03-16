import { FreState } from "../views/FrePage"

export class FreController {
    setFreDone!: React.Dispatch<React.SetStateAction<boolean>>;
    setStage!: React.Dispatch<React.SetStateAction<FreState>>;
    setShowLoading!: React.Dispatch<React.SetStateAction<boolean>>;

    firstPageResolver!: (value: unknown) => void;
    secondPageResolver!: (value: unknown) => void;
    thirdPageResolver!: (value: unknown) => void;
}

export let freController = new FreController();