import React, { Component } from 'react';
import { array } from 'prop-types';
import defaultClasses from './slidercss';
import classify from '../../../classify';
import Column from './column.js';
import { validatedProps } from '../storage/props';


class Slider extends Component {

    static propTyped = {
        renderableColumns: array.isRequired
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
        //reference
    }

    render() {
        let { position, id } = this.props;
        let { columns } = validatedProps.sliders[id];

        return (
            <ul style={{left: `${ (100/columns)*-position }%`}}
                className={'slider'}>
                {this.getContent()}
            </ul>
        )
    }
}

export default classify(defaultClasses)(Slider);