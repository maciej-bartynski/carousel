import React, { Component } from 'react';
import defaultClasses from './columnItemcss';
import classify from '../../../classify';
import { number } from 'prop-types';

class ColumnItem extends Component {

    static propTyped = {
        columnIndex: number.isRequired,
        rowIndex: number.isRequired,
    }

    getContent() {
        let { SingleItem, columnIndex, rowIndex } = this.props;
        return (
            <SingleItem
                columnIndex={columnIndex}
                rowIndex={rowIndex} />
        )
    }

    componentDidMount() {
        //reference
    }

    render() {
        return (
            <div className={'columnItem'}>
                {this.getContent()}
            </div>
        )
    }
}

export default classify(defaultClasses)(ColumnItem);