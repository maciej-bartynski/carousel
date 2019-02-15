import React, { Component } from 'react';
import { array } from 'prop-types';
import defaultClasses from './slidercss';
import classify from '../../../classify';
import Column from './column.js';

class Slider extends Component {

    static propTyped = {
        renderableColumns: array.isRequired
    }

    constructor(props){
        super(props);
        this.sliderNode = React.createRef();
    }

    getContent() {
        let { renderableColumns, id, validatedProps } = this.props;
        let { columns } = validatedProps.sliders[id];

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
        references.sliderReference=this;
        references.sliderNodeRefs.push(this.sliderNode);
    }

    render() {
        let { validatedProps, actions, references } = this.props;
        let { position, id } = this.props;
        let { columns } = validatedProps.sliders[id];

        let sliderRef = this.sliderNode;
        let initialCssPosition = (100/columns)*-position;
        let singleShift = 100/columns;

        return (
            <ul ref={this.sliderNode}
                style={{left: `${ (100/columns)*-position }%`}}
                className={'slider'}
                
                onTouchMove={e => {
                    actions.onSwipeProgressHandler(e);
                }}

                onTouchStart={e => {
                    actions.onSwipeStartHandler(e, sliderRef, initialCssPosition, singleShift);
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