import React from 'react';
import defaultClasses from './column.css';
import { shape, string } from 'prop-types';
import classify from 'src/classify';

let singleItem = (JSX, unique, idx) => { 
    return <JSX unique={unique} key={idx}/>
}

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        let { outerFunctionToColumn, unique } = this.props;
        if (outerFunctionToColumn) {
            outerFunctionToColumn(unique);
        }
    }

    render() {
        let { classes, unique, item } = this.props;

        return (
            <div onClick={this.clickHandler} className={classes.wrapper}>
                {item.map((el, idx)=>{
                    return singleItem(el, unique, idx)
                })}
            </div>
        );
    }
}

Column.propTypes = {
    classes: shape({
        imgSliderItem: string
    })
};

export default classify(defaultClasses)(Column);
