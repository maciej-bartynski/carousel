import React, { Component } from 'react';
import { array } from 'prop-types';
import defaultClasses from './slidercss';
import classify from '../../../classify';
import Column from './column.js';
import { validatedProps } from '../root';
import { references } from '../root';


class Slider extends Component {

    static propTyped = {
        renderableColumns: array.isRequired
    }

    constructor(props){
        super(props);
        this.sliderNode = React.createRef();
    }

    getContent() {
        let { renderableColumns, id } = this.props;
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
        references.sliderReference=this;
        references.sliderNodeRefs.push(this.sliderNode);
    }

    render() {
        let { position, id } = this.props;
        let { columns } = validatedProps.sliders[id];

        return (
            <ul ref={this.sliderNode}
                style={{left: `${ (100/columns)*-position }%`}}
                className={'slider'}>
                {this.getContent()}
            </ul>
        )
    }
}

export default classify(defaultClasses)(Slider);