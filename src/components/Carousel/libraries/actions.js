export class Actions {
    constructor(context) {
        this.context = context;
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onColumnClick = this.onColumnClick.bind(this);
        this.onSwipeEndHandler = this.onSwipeEndHandler.bind(this);
        this.onSwipeProgressHandler = this.onSwipeProgressHandler.bind(this);
        this.onSwipeStartHandler = this.onSwipeStartHandler.bind(this);
        
    }

    onButtonClick(dir) {
        let by = this.context.propsClone.settings.maxFullScreen;
        let infinite = this.context.propsClone.settings.infinite;
        this.context.stateClone.animatableChangePosition(dir, by);

        if (!infinite) return;
        let its = this;
        setTimeout(
            () => its.context.stateClone.secretelyChangePosition(dir, by), its.context.propsClone.settings.duration
        )
    }

    onColumnClick(to) { 
        let infinite = this.context.propsClone.settings.infinite;
        
        this.context.stateClone.animatableChangePosition(false, false, to);
        if (!infinite) return;
        let its = this;
        setTimeout( 
            () => {its.context.stateClone.secretelyChangePosition(1, false, to)}, its.context.propsClone.settings.duration
        )
    }

    onSwipeEndHandler(e) {
        let end = this.swipeOrDragEventUnify(e);
        let dx = end - this.swipeX;
        let sign = Math.sign(dx);
        let percentDx = Math.floor(100 / (this.wrapperWidth / dx));
        let howMuchCols = Math.ceil(percentDx / this.singleShift);
        let infinite = this.context.propsClone.sliders[0].infinite;

        if ((this.context.references.rootReference.state.position - howMuchCols) < 0 ||
            (this.context.references.rootReference.state.position - howMuchCols) > this.context.stateClone.maxRight) {
            this.adjustSlider();
            return;
        }
        if (howMuchCols === 0) {
            howMuchCols = 1;
        }
        this.context.stateClone.animatableChangeState(-sign, Math.abs(howMuchCols));
        if (!infinite) return;
        let its = this;
        setTimeout(
            () => its.context.stateClone.secretelyChangeState(-sign, Math.abs(howMuchCols)), its.context.propsClone.settings.duration
        )
    }

    swipeOrDragEventUnify(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    onSwipeStartHandler(e, sliderRef, initialCssPosition, singleShift) {
        this.singleShift = singleShift;
        this.initialCssPosition = initialCssPosition;
        this.sliderRef = sliderRef;
        let wrapperWidth = this.context.references.rootNode.current.getBoundingClientRect();
        this.wrapperWidth = wrapperWidth.left + wrapperWidth.right;
        this.swipeX = this.swipeOrDragEventUnify(e);
    }

    onSwipeProgressHandler(e) {
        let dx = this.swipeOrDragEventUnify(e) - this.swipeX;
        let sign = Math.sign(dx);
        let abs = Math.abs(dx);
        let percentDx = Math.floor(100 / (this.wrapperWidth / abs)) * sign;
        this.sliderRef.current.style.left = this.initialCssPosition + percentDx + '%';
        this.isSwipingOrNot += 1;
    }

    adjustSlider() {
        this.sliderRef.current.style.left = this.initialCssPosition + '%';
    }
}