import { rootComponentState } from './../root';
import { validateProps } from './props';

export let stateClone = {
    position: 0,
    maxRight: validateProps.sliders[0].validColumns.length - validateProps.sliders[0].validColumns.leftOverflow,
    duration: validateProps.settings.duration,

    __beforeChange() {
        sliderReference.style.transition = `${duration}ms linear left`;
    },

    animatableChange(direction, by, to) {

        this.__beforeChange();

        let demandedPosition = this.position + (direction * by);
        demandedPosition = to ? to : demandedPosition;

        let newPosition = (demandedPosition < 0 || demandedPosition > this.maxRight) ?
            (demandedPosition < 0 ? 0 : this.maxRight) : demandedPosition;

        this.shiftBy = newPosition - this.position;
        this.position = newPosition

        if (shiftBy !== 0){
            rootComponentState({ position: this.position });
        }

        setTimeout(
            this.__afterChange, this.duration
        )

    },

    __afterChange() {
        sliderReference.style.transition = '0ms linear left';
    },

    secretelyChange(direction, by, to){
        let demandedPosition = this.position + (direction * by);
        demandedPosition = to ? to : demandedPosition;

        let newPosition = (demandedPosition < 0 || demandedPosition > this.maxRight) ?
            (demandedPosition < 0 ? 0 : this.maxRight) : demandedPosition;

        this.shiftBy = newPosition - this.position;
        this.position = newPosition

        if (shiftBy !== 0){
            rootComponentState({ position: this.position });
        }
    }
}