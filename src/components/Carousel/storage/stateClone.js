
import { arrayOperations } from './../libraries/arrayOperations';

export class StateClone {
    constructor(context) {
        this.context = context;
        this.__afterChange = this.__afterChange.bind(this);

        this.position = 0;
        this.maxRight = [];
        this.individualPositions = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    animatableChangePosition(direction, by, to) {
        let { sliders } = this.context.propsClone;
        let { maxRigthForBiggestSlider } = this.context.propsClone.settings;
        let { sliderNodeRefs } = this.context.references;
        this.demandPositionForAllSliders(direction, by, to, maxRigthForBiggestSlider );
        this.__beforeChange();
        sliders.forEach((slider, idx) => {
            let singleSliderPosition = this.calculateValidPositionForEachSlider(this.maxRight[idx], idx);
            this.changePosition(singleSliderPosition, slider, sliderNodeRefs[idx]);
        })
        let its = this;
        setTimeout(
            its.__afterChange, its.context.propsClone.settings.duration
        )
    }

    demandPositionForAllSliders(direction, by, to, maxRigthForBiggestSlider ) {
        let demandedPosition = this.position + (direction * by);
        demandedPosition = to ? to : demandedPosition;
       
        demandedPosition = (demandedPosition < 0 || demandedPosition >  maxRigthForBiggestSlider) ?
            (demandedPosition < 0 ? 0 : maxRigthForBiggestSlider) : demandedPosition;
        this.position = demandedPosition; 
    }

    calculateValidPositionForEachSlider(maxRight, idx) {
        let individualPosition = (this.position < 0 || this.position > maxRight) ?
            (this.position < 0 ? 0 : maxRight) : this.position;
        this.individualPositions[idx] = individualPosition; 
        return individualPosition;
    }

    changePosition(singleSliderPosition, singleSlider, singleSliderNode) {
        singleSliderNode.current.style.left = -singleSliderPosition * singleSlider.shiftBy + '%';
    }

    secretelyChangePosition(dir, by, to){
        let { sliders, settings } = this.context.propsClone;
        let { sliderNodeRefs } = this.context.references;

        if (by===false){
            by = to - settings.maxFullScreen;
            dir = 1;
        } 

        let sliceIndex = dir * by;
        this.position = settings.maxFullScreen;
        sliders.forEach((slider, idx) => {
            this.changePosition(by, slider, sliderNodeRefs[idx]);
            slider.validColumns = arrayOperations.columnsArrayRebuild(slider.validColumns, sliceIndex)
            this.context.references.rootReference.setState({renderableColumns: slider.validColumns})
        })

    }

    __beforeChange() {
        let duration = this.context.propsClone.settings.duration;
        this.context.references.sliderNodeRefs.forEach((node) => {
            node.current.style.transition = `${duration}ms linear left`;
        })
    }

    __afterChange() {
        this.context.references.sliderNodeRefs.forEach((node) => {
            node.current.style.transition = `0ms linear left`;
        })
    }
}