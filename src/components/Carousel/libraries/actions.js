export class Actions {
    constructor(context) {
        this.context = context;
        this.onShiftBy = this.onShiftBy.bind(this);
        this.onShiftTo = this.onShiftTo.bind(this);

        this.whatDirection = 1;

    }

    onShiftBy(direction, by, isFullView){
        if (isFullView) {
            by = this.context.propsClone.settings.leftOverflow;
        }
        this.context.stateClone.demandColumnIndex(direction, by, null);
        this.context.stateClone.setCurrentRootPosition();
        this.context.stateClone.animatablyAdjustAllSlidersToIndividualPositions();

        clearTimeout(this.timer);
        this.onAutoplay();
    }

    onShiftTo(to){
        let direction = Math.sign(to - this.context.stateClone.currentRootPosition);
        this.context.stateClone.demandColumnIndex(direction, null, to);
        this.context.stateClone.setCurrentRootPosition();
        this.context.stateClone.animatablyAdjustAllSlidersToIndividualPositions();
        
        clearTimeout(this.timer);
        this.onAutoplay();
    }

    onAutoplay(){
        let { settings } = this.context.propsClone;
        if (!settings.autoplay) return;
        let { infinite, autoplayDuration } = settings;
        let its = this;
        
        this.timer = setTimeout(
            () => { 
                if (infinite) {
                    its.onShiftBy(1, 1)
                } else {
                    its.whatDirectionForAutoplay();
                    its.onShiftBy(this.whatDirection, 1)
                }
            }, autoplayDuration
        )
    }

    whatDirectionForAutoplay(){
        let { currentRootPosition } = this.context.stateClone;
        let { maxRightPosition } = this.context.propsClone.settings;

        this.whatDirection = (currentRootPosition >= maxRightPosition || currentRootPosition <= 0) ?
            (currentRootPosition >= maxRightPosition) ? -1 : 1 : this.whatDirection;
    }
}