
import { arrayOperations } from './../libraries/arrayOperations';

export class StateClone {
    constructor(context){
        this.context = context;
        this.__afterChange = this.__afterChange.bind(this);
    }

    animatableChangeState(direction, by, to) {
        this.__beforeChange();
        this.__changeState(direction, by, to);
        let its = this;
        setTimeout(
            its.__afterChange, its.context.validatedProps.settings.duration
        )

    }

    secretelyChangeState(direction, by, to) {
        if (by===false){
            by = to - this.context.validatedProps.maxFullScreen;
            direction = 1;
        }
        let sliceIndex = direction * by;
        this.context.validatedProps.sliders.forEach((slider, idx)=>{
            slider.validColumns = arrayOperations.columnsArrayRebuild(slider.validColumns, sliceIndex)
        })
    
        this.__changeState(false, false, this.context.validatedProps.maxFullScreen);
    }

    __beforeChange() {
        let duration = this.context.validatedProps.settings.duration;
        this.context.references.sliderNodeRefs.forEach((node)=>{
            node.current.style.transition = `${duration}ms linear left`;
        })
    }

    __afterChange() {
        this.context.references.sliderNodeRefs.forEach((node)=>{
            node.current.style.transition = `0ms linear left`;
        })
    }

    __changeState(direction, by, to) {
        let demandedPosition = this.position + (direction * by);
        demandedPosition = to ? to : demandedPosition;

        let newPosition = (demandedPosition < 0 || demandedPosition > this.maxRight) ?
            (demandedPosition < 0 ? 0 : this.maxRight) : demandedPosition;

        this.shiftBy = newPosition - this.position;
        this.position = newPosition

        if (this.shiftBy !== 0) {
            this.context.references.rootReference.changePosition({ position: this.position });
        } else {
            this.context.actions.adjustSlider(); 
        }
    }
}