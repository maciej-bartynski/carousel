import React, { Component } from 'react';
import defaultClasses from './slidercss';
import classify from '../../../classify';
import Column from './column.js';
import { array, string, shape } from 'prop-types';

class Slider extends Component {

    static propTypes = {
        renderableColumns: array.isRequired,
        classes: shape({
            column: string,
            slider: string
        })
    }

    constructor(props){
        super(props);
        this.sliderNode = React.createRef();
    }

    getContent() {
        let { renderableColumns, id, propsClone } = this.props;
        let { columns } = propsClone.sliders[id];
        let { classes } = this.props;

        return renderableColumns.map((singleColumn, columnIndex) => {
            return (
                <li key={columnIndex}
                    style={{ width: `${100/columns}%`}}
                    className={'column'}>
                    <Column
                        singleColumn={singleColumn}
                        columnIndex={columnIndex} />
                </li>
            )
        })
    }

    componentDidMount() {
        let { references } = this.props;
        references.sliderReference = this;
        references.sliderNodeRefs.push(this.sliderNode);
    }

    render() {
        let { propsClone, actions } = this.props;
        let { position, id } = this.props;
        let { columns } = propsClone.sliders[id];

        let sliderRef = this.sliderNode;
        let initialCssPosition = (100/columns)*-position;
        let singleShift = 100/columns;

        let { classes } = this.props;
        return (
            <ul ref={this.sliderNode}
                style={{left: `${ (100/columns)*-position }%`}}
                className={'slider'}
                
                onTouchMove={e => {
                    actions.onSwipeProgressHandler(e);
                }}

                onTouchStart={e => {
                    actions.onSwipeStartHandler(e, initialCssPosition);
                }}

                onTouchEnd={e => {
                    actions.onSwipeEndHandler(e);
                }}>
                {this.getContent()}
            </ul>
        )
    }
}

export default classify(defaultClasses)(Slider);