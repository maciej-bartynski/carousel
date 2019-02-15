import { rootComponentState } from './../root';
import { validatedProps } from './../root';
import { references } from './../root';

export class StateClone {

    animatableChangeState(direction, by, to) {
        this.__beforeChange();
        this.__changeState(direction, by, to);
        setTimeout(
            this.__afterChange, validatedProps.settings.duration
        )

    }

    secretelyChangeState(direction, by, to) {
        this.__changeState(direction, by, to);
    }

    __beforeChange() {
        let duration = validatedProps.settings.duration;
        references.sliderNodeRefs.forEach((node)=>{
            node.current.style.transition = `${duration}ms linear left`;
        })
    }

    __afterChange() {
        references.sliderNodeRefs.forEach((node)=>{
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
            references.rootReference.changePosition({ position: this.position });
        }
    }
}