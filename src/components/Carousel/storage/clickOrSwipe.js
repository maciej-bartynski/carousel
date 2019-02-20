import { findDOMNode } from 'react-dom';

export class ClickOrSwipe {
    constructor() {
        this.context = null;
        this.sliderNode = null;
        this.wrapperNode = null;
        this.columnPxWidth = null;
        this.sliderId = null;

        this.swipeOrDragEventUnify = this.swipeOrDragEventUnify.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.adjustSlider = this.adjustSlider.bind(this);

        this.prepareSliderForUse = this.prepareSliderForUse.bind(this);
        this.sliderPrepared = false;

        this.sliderNodePositionInPx = null;
        this.isPotentiallyLocked = false;
        this.isLocked = false;
        this.swipeX=null;
        this.swipeEnd=null;
    }

    swipeOrDragEventUnify(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    onMouseEnter(){
        this.prepareSliderForUse();
    }

    onMouseDown(e){
        this.isPotentiallyLocked = true;
        this.swipeX = this.swipeOrDragEventUnify(e);
        if(this.sliderPrepared) return;
        this.prepareSliderForUse();
    }

    onMouseUp(e){
        this.isPotentiallyLocked = false;
        this.isLocked = false;
        this.swipeEnd = this.swipeOrDragEventUnify(e);

        this.calculateNewPosition();
        this.adjustSlider();
    }

    onMouseLeave(e){
        if (this.isLocked) {
            this.swipeEnd = this.swipeOrDragEventUnify(e);
            this.calculateNewPosition();
            this.adjustSlider();
        }
        this.isPotentiallyLocked = false;
        this.isLocked = false;
        this.swipeX = null;
        this.swipeEnd = null; 
    }

    onMouseMove(e){
        if (this.isPotentiallyLocked && !this.isLocked){
            this.isLocked = true;
            return;
        }
        if (!this.isLocked) return;

        let currentClientPos = this.swipeOrDragEventUnify(e) - this.swipeX; 
        this.sliderNode.current.style.left = this.sliderNodePositionInPx + currentClientPos + 'px';
    }

    adjustSlider(){
        if (this.newPosition > 0 ) {
            this.context.dispatchClick = false;
            this.context.props.actions.onShiftBy(this.direction, this.newPosition);
        } else {
            this.context.dispatchClick = true;
            this.sliderNode.current.style.transition = 'left 200ms linear';
            this.sliderNode.current.style.left = this.sliderNodePositionInPx + 'px';
        }
    }

    calculateNewPosition(){
        let byPx = (this.swipeEnd - this.swipeX);
        this.direction = Math.sign(byPx) * -1;
        let byColumns = Math.abs(byPx / this.columnPxWidth);
        this.newPosition = Math.floor( byColumns + 0.5 );
    }

    prepareSliderForUse(){
        this.sliderPrepared = true;
        this.sliderNodePositionInPx = findDOMNode(this.sliderNode.current).offsetLeft;
        let wrapper = findDOMNode(this.context.props.references.rootNodeRef.current).offsetWidth;
        let cols = this.context.props.propsClone.sliders[this.sliderId].columns;
        this.columnPxWidth = wrapper/cols;
    }
}