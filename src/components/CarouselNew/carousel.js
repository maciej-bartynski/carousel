import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './carousel.css';
import Column from './carouselElements/column';


class Carousel extends Component {
    static propTypes = {
        classes: shape({
            wrapper: string,
            slidersContainer: string,
            slider: string
        })
    };

    constructor(props) {
        super(props);
        this.initialWidthValues();
        this.onSwipeStartHandler = this.onSwipeStartHandler.bind(this);
        this.onSwipeProgressHandler = this.onSwipeProgressHandler.bind(this);
        this.onSwipeEndHandler = this.onSwipeEndHandler.bind(this);
        this.onClickHandlerWhenNotSwipe = this.onClickHandlerWhenNotSwipe.bind(this);
        this.wrapperRef = React.createRef();
        this.sliderRef = React.createRef();
        this.isSwipingOrNot = 0;
    }

    onClickHandlerWhenNotSwipe(unique) {
        if (!this.isSwipingOrNot || this.isSwipingOrNot < 10) {
            this.props.clickOnColumnHandler(unique);
        } else {
            this.isSwipingOrNot = 0;
        }
    }

    onSwipeEndHandler(e) {
        if (!this.locked) return;
        let end = this.swipeOrDragEventUnify(e);
        let dx = end - this.swipeX;
        let sign = Math.sign(dx);
        let abs = Math.abs(dx);
        let percentDx = Math.floor(100 / (this.wrapperWidth / abs));
        let howMuchCols = percentDx / this.singleShift;
        if (howMuchCols < 0.33) {
            this.adjustSliderWhenNothingChanged();
        } else {
            howMuchCols = Math.ceil(percentDx / this.singleShift);
            this.props.changeLogicalPosition(-sign, howMuchCols);
        }
    }

    swipeOrDragEventUnify(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    onSwipeStartHandler(e) {
        this.swipeX = this.swipeOrDragEventUnify(e);
        this.initialPx = parseInt(this.sliderRef.current.style.left);
    }


    onSwipeProgressHandler(e) {
        if (!this.locked) return;
        let dx = this.swipeOrDragEventUnify(e) - this.swipeX;
        let sign = Math.sign(dx);
        let abs = Math.abs(dx);
        let percentDx = Math.floor(100 / (this.wrapperWidth / abs)) * sign;
        this.sliderRef.current.style.left = parseInt(this.initialCssPosition) + percentDx + '%';
        this.isSwipingOrNot += 1;
    }

    initialWidthValues() {
        let { visibleColumns } = this.props;
        this.singleShift = 100 / visibleColumns;
        this.shiftUnit = '%';

    }

    componentDidUpdate() {
        this.initialCssPosition = this.props.left;
    }

    componentDidMount() {
        let wrapperSize = this.wrapperRef.current.getBoundingClientRect();
        this.wrapperWidth = Math.abs(wrapperSize.right - wrapperSize.left);
        this.initialCssPosition = this.props.left;
        this.props.sliderRef(this);
    }

    adjustSliderWhenNothingChanged() {
        this.sliderRef.current.style.left = this.initialCssPosition;
    }

    render() {
        let {
            classes
        } = this.props;
        let { validColumns, isSlider } = this.props

        return (
            <div ref={this.wrapperRef} className={classes.wrapper}>
                <ul
                    onTouchMove={e => {
                        if (!isSlider) return;
                        if (this.clicked) this.locked = true;
                        this.onSwipeProgressHandler(e);
                    }}

                    onTouchStart={e => {
                        if (!isSlider) return;
                        this.clicked = true;
                        this.onSwipeStartHandler(e);
                    }}

                    onTouchEnd={e => {
                        if (!isSlider) return;
                        this.onSwipeEndHandler(e);
                        this.locked = false;
                        this.clicked = false;
                    }}

                    onMouseDown={e => {
                        if (!isSlider) return;
                        this.clicked = true;
                        this.onSwipeStartHandler(e);
                    }}

                    onMouseUp={e => {
                        if (!isSlider) return;
                        this.onSwipeEndHandler(e);
                        this.locked = false;
                        this.clicked = false;
                    }}

                    onMouseMove={e => {
                        if (!isSlider) return;
                        if (this.clicked) this.locked = true;
                        this.onSwipeProgressHandler(e);
                    }}

                    onMouseLeave={e => {
                        if (!isSlider) return;
                        this.onSwipeEndHandler(e);
                        this.locked = false;
                        this.clicked = false;
                    }}

                    style={{
                        left: this.props.left,
                        transition: this.props.transition
                    }}
                    ref={this.sliderRef}
                    className={classes.slider}
                >
                    {validColumns.map((item, idx) => {
                        return (
                            <li
                                style={{ width: this.singleShift + '%' }}
                                className={classes.column}
                                key={idx}
                                onMouseUp={(e) => { this.onClickHandlerWhenNotSwipe(idx) }}

                            >
                                <Column unique={idx} item={item} />
                            </li>
                        );
                    })}
                </ul>

            </div>
        );
    }
}

export default classify(defaultClasses)(Carousel);
