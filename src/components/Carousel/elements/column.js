import React, { Component } from 'react';
import defaultClasses from './columncss';
import classify from '../../../classify';
import { array, number } from 'prop-types';
import ColumnItem from './columnItem';

class Column extends Component {

    static propTyped = {
        singleColumn: array.isRequired,
        columnIndex: number.isRequired,
    }

    getContent() {
        let { singleColumn, columnIndex } = this.props;

        return singleColumn.map((singleItem, rowIndex) => {
            return (
                <ColumnItem
                    SingleItem={singleItem}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    key={rowIndex} />
            )
        })
    }

    componentDidMount() {
        //reference
    }

    render() {
        return (
            <div className={'container'}>
                {this.getContent()}
            </div>
        )
    }
}

export default classify(defaultClasses)(Column);