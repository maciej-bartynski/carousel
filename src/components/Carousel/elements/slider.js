import React, { Component } from 'react';
import defaultClasses from './slidercss';
import classify from '../../../classify';
import Column from './column.js';
import { array, string, shape } from 'prop-types';
import { ClickOrSwipe } from './../storage/clickOrSwipe';

class Slider extends Component {

    static propTypes = {
        classes: shape({
            column: string,
            slider: string
        })
    }

    constructor(props) {
        super(props);
        this.sliderNode = React.createRef();
        this.dispatchClick = false;
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidMount() {
        let { references, clickOrSwipe, id } = this.props;
        references.sliderContextRefs.push(this);
        references.sliderNodeRefs.push(this.sliderNode);
        clickOrSwipe.context = this;
        clickOrSwipe.sliderNode = this.sliderNode;
        clickOrSwipe.sliderId = id;
    }

    componentWillUnmount() {
        let { references, id } = this.props;
        references.sliderContextRefs[id] = null;
        references.sliderNodeRefs[id] = null;
    }

    componentDidUpdate() {
        let { references, id, clickOrSwipe } = this.props;
        references.sliderContextRefs[id] = this;
        references.sliderNodeRefs[id] = this.sliderNode;
        clickOrSwipe.context = this;
        clickOrSwipe.sliderNode = this.sliderNode;
        clickOrSwipe.sliderId = id;
    }

    getContent() {
        let { id, propsClone, references } = this.props;
        let { validColumns, shiftBy } = propsClone.sliders[id];
        let { classes } = this.props;

        return validColumns.map((singleColumn, columnIndex) => {
            return (
                <li
                    onClick={() => this.onClickHandler(columnIndex)}
                    key={columnIndex}
                    style={{ width: `${shiftBy}%` }}
                    className={'column'}>
                    <Column
                        singleColumn={singleColumn}
                        columnIndex={columnIndex} />
                </li>
            )
        })
    }

    onClickHandler(to) {
        let { actions, propsClone, id } = this.props;
        if (!this.dispatchClick) return;
        if (!propsClone.sliders[id].columnNavi) return;
        actions.onShiftTo(to);
        this.dispatchClick = false;
    }

    render() {
        let { propsClone, id, clickOrSwipe } = this.props;
        let { initialPosition, shiftBy } = propsClone.sliders[id];
        let { classes } = this.props;

        return (
            <ul ref={this.sliderNode}
                style={{ left: `${shiftBy * -initialPosition}%` }}
                className={'slider'}

                onMouseEnter={
                    e => {
                        clickOrSwipe.onMouseEnter(e)
                    }
                }

                onMouseLeave={
                    e => {
                        clickOrSwipe.onMouseLeave(e);
                    }
                }

                onMouseDown={
                    e => {
                        clickOrSwipe.onMouseDown(e)
                    }
                }

                onMouseUp={
                    e => {
                        clickOrSwipe.onMouseUp(e)
                    }
                }

                onMouseMove={
                    e => {
                        clickOrSwipe.onMouseMove(e)
                    }
                }

                onTouchMove={e => {
                    clickOrSwipe.onSwipeProgress(e);
                }}

                onTouchStart={e => {
                    clickOrSwipe.onSwipeStart(e);
                }}

                onTouchEnd={e => {
                    clickOrSwipe.onSwipeEnd(e);
                }}>
                {this.getContent()}
            </ul>
        )
    }
}

export default classify(defaultClasses)(Slider);