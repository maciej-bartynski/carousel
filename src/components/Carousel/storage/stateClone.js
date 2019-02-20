import { arrayOperations } from '../libraries/arrayOperations';

export class StateClone {
    constructor(context) {
        this.context = context;
        this.currentRootPosition = null;
        this.demandedColumnIndex = null;
        this.sliceIndex = null;

        this.setSliceIndex = this.setSliceIndex.bind(this);
        this.resetSliderIfInfinite = this.resetSliderIfInfinite.bind(this);
        this.demandColumnIndex = this.demandColumnIndex.bind(this);
        this.setCurrentRootPosition = this.setCurrentRootPosition.bind(this);
        this.adjustSliderToIndividualPosition = this.adjustSliderToIndividualPosition.bind(this);
        this.animatablyAdjustAllSlidersToIndividualPositions = this.animatablyAdjustAllSlidersToIndividualPositions.bind(this);
        this.__afterChange = this.__afterChange.bind(this);
        this.__beforeChange = this.__beforeChange.bind(this);
    };

    setSliceIndex(sliderData) {
        let borderIndex = this.context.propsClone.settings.leftOverflow;
        this.sliceIndex = this.currentRootPosition - borderIndex;
        this.sliceIndex = Math.sign(this.sliceIndex) < 0 ?
            sliderData.validColumns.length + this.sliceIndex : this.sliceIndex;
        console.log(this.currentRootPosition)
    }

    resetSliderIfInfinite() {
        console.log(this.context.propsClone.sliders)
        this.context.propsClone.sliders.forEach((sliderData, idx)=>{
            let sliderNode = this.context.references.sliderNodeRefs[idx];
            this.setSliceIndex(sliderData);
            let newValidatedColumns = arrayOperations.columnsArrayRebuild(sliderData.validColumns, this.sliceIndex);
            sliderData.validColumns = newValidatedColumns;
            sliderNode.current.style.left = sliderData.shiftBy * -sliderData.initialPosition + '%';
        })
        this.currentRootPosition = this.context.propsClone.settings.leftOverflow ;
    }

    demandColumnIndex(direction, by, to) {

        if (direction === null && by !== null) {
            console.log('Direction must be settled');
            return;
        }

        if (by !== null) {
            this.demandedColumnIndex = this.currentRootPosition + (by * direction);
            return;
        }

        this.demandedColumnIndex = to;
    }

    setCurrentRootPosition() {
        let max = this.context.propsClone.settings.maxRightPosition;
        let min = 0;

        let setPosition = (this.demandedColumnIndex > max || this.demandedColumnIndex < min) ?
            (this.demandedColumnIndex > max) ? max : min : this.demandedColumnIndex;

        this.currentRootPosition = setPosition;
    }

    adjustSliderToIndividualPosition(proposedColumnIndex, sliderNode, sliderData) {

        if (!sliderData.slider) return;

        let max = sliderData.individualMaxRight;
        let min = 0;

        let setPosition = (proposedColumnIndex > max || proposedColumnIndex < min) ?
            (proposedColumnIndex > max) ? max : min : proposedColumnIndex;

        sliderData.individualCurrenPosition = setPosition;
        sliderNode.current.style.left = setPosition * -sliderData.shiftBy + '%';
    }

    animatablyAdjustAllSlidersToIndividualPositions() {
        
        this.context.references.sliderNodeRefs.forEach((sliderNode, idx) => {
            this.__beforeChange(sliderNode);
            let sliderData = this.context.propsClone.sliders[idx];
            this.adjustSliderToIndividualPosition(this.currentRootPosition, sliderNode, sliderData);
        })

        

        let its = this;
        setTimeout(
            () => {
                its.__afterChange()
                if (!its.context.propsClone.settings.infinite) return;
                its.resetSliderIfInfinite();
                its.context.references.provider.setState({
                    propsClone: this.context.propsClone
                })
            },
            its.context.propsClone.settings.duration
        );
    }

    __beforeChange(sliderNode) {
        let duration = this.context.propsClone.settings.duration;
        sliderNode.current.style.transition = `${duration}ms linear left`;
    }

    __afterChange() {
        this.context.references.sliderNodeRefs.forEach((sliderNode)=>{
            sliderNode.current.style.transition = `0ms linear left`;
        })
    }
}