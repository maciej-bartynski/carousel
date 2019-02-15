import React, { Component } from 'react';
import { string, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './switchers.css';

import ChevronLeftIcon from 'react-feather/dist/icons/chevron-left';
import ChevronRightIcon from 'react-feather/dist/icons/chevron-right';
import Icon from 'src/components/Icon';

class Switchers extends Component {
    static propTypes = {
        classes: shape({
            btnsContainer: string,
            btnLeft: string,
            btnRight: string
        })
    };

    constructor(props) {
        super(props);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(direction, by, to) {
        this.props.changeLogicalPosition(direction, by, to);
    }

    render() {
        let { classes, by } = this.props;
        return (
            <div className={classes.btnsContainer}>
                <div
                    className={classes.btnLeft}
                    onClick={() => {
                        this.onClickHandler(-1, by, false);
                    }}
                >
                    <Icon src={ChevronLeftIcon} attrs={{ stroke: '#ddd' }} />
                </div>
                <div
                    className={classes.btnRight}
                    onClick={() => {
                        this.onClickHandler(1, by, false);
                    }}
                >
                    <Icon src={ChevronRightIcon} attrs={{ stroke: '#ddd' }} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Switchers);
