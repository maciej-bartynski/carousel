import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from './carousel';
import Switchers from './carouselElements/switchers';
import focusify from '../../focusify/focusable.js';

class Root extends Component {
    static propTypes = {
        columns: PropTypes.number,
        rows: PropTypes.number,
        slider: PropTypes.bool,
        infinite: PropTypes.bool,
        items: PropTypes.array,
        navigators: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            logicalPosition: 0,
            validColumns: [],
            transition: 'left 0ms linear'
        }
        this.allCSSpositions = [];
        this.propsValidation();
        this.animatingAdjustSliderToNewPosition = this.animatingAdjustSliderToNewPosition.bind(this);
        this.secretlyBackToInitialSliderPosition = this.secretlyBackToInitialSliderPosition.bind(this);
        this.clickOnColumnHandler = this.clickOnColumnHandler.bind(this);
    }

    clickOnColumnHandler(unique){
        if (this.props.clickOnColumnHandler){
            this.props.clickOnColumnHandler(unique);
        }
        this.sliderRef.isSwipingOrNot = 0;
    }

    componentWillMount() {
        this.props.__focusify__SET_ME_AS__controlledComponent(this);
        this.logicalPosition = this.props.infinite ? this.props.columns : 0,
            this.setState({
                validColumns: this.validColumns
            })
    }

    componentDidMount() {
        if (this.props.hoistComponentReference) this.props.hoistComponentReference(this);
    }

    animatingAdjustSliderToNewPosition(direction, by, to) {
        if (!this.isSlider) return;
        this.calculateNewLogicalPosition(direction, by, to);
        this.checkIfPositionChanged();
        if (!this.hasChangded) return;
        this.animatableGoToNewLogicalPosition();
        let its = this;
        setTimeout(
            this.secretlyBackToInitialSliderPosition,
            this.duration
        )
    }

    checkIfPositionChanged() {
        if (!this.hasChangded /*&& !this.isInfinite*/) {      
            this.sliderRef.adjustSliderWhenNothingChanged();
        }
    }

    calculateNewLogicalPosition(direction, by, to) {
        let demandedPosition = this.logicalPosition + (direction * by);
        demandedPosition = to ? to : demandedPosition;

        let newPosition = (demandedPosition < 0 || demandedPosition > this.maxRight) ?
            (demandedPosition < 0 ? 0 : this.maxRight) : demandedPosition;
        
        this.hasChangded = this.logicalPosition !== newPosition;
        this.logicalPosition = newPosition;
        this.direction = direction;
    }

    animatableGoToNewLogicalPosition() {
        this.setState({
            transition: `left ${this.duration}ms linear`,
        })
    }

    secretlyBackToInitialSliderPosition() {
        if (!this.isInfinite) return;
        if (!this.hasChangded) return;
        let { columns } = this.props;
        this.rebuildColumnsArray();
        this.logicalPosition = columns;
        this.secretlyGoToInitialLogicalPosition();
    }

    rebuildColumnsArray() {
        let items = this.validColumns
        let { columns } = this.props;
        this.diff = Math.abs(columns - this.logicalPosition);
        let head, tail;
        if (this.direction === 1) {
            head = items.slice(0, this.diff);
            tail = items.slice(this.diff);
        } else {
            head = items.slice(0, this.validItems.length - this.diff);
            tail = items.slice(this.validItems.length - this.diff);
        }
        this.validColumns = tail.concat(head);
    }

    secretlyGoToInitialLogicalPosition() {
        let { columns } = this.props;
        this.logicalPosition = columns;
        this.setState({
            transition: 'left 0ms linear',
            validColumns: this.validColumns
        })
    }

    propsValidation() {
        let { items, columns, rows, slider, navigators, infinite } = this.props;

        this.isSlider = slider === true || slider === false ? slider : true;
        this.isInfinite = infinite === true || infinite === false ? infinite : false;
        this.isInfinite = !this.isSlider ? false : this.isInfinite;

        this.visibleColumns = columns ? columns : 5;
        this.visibleRows = rows ? rows : 1;
        this.hasNavigators = navigators ? navigators : false;
        this.validItems = this.isSlider ? this.itemsValidator(items) : items;
        this.columnsCreator();
        this.cssPositionsCreator();

        this.isSlider = this.validColumns.length <= this.visibleColumns ? false : this.isSlider;
        this.hasNavigators = this.isSlider ? this.hasNavigators : false;

        this.maxLeft = this.isInfinite ? columns : 0;
        this.maxRight = this.isInfinite ? this.validColumns.length -1 : this.validColumns.length - (columns) ;
        this.logicalPosition = this.isInfinite ? columns : 0;
        this.duration = this.props.duration ? this.props.duration : 200;
    }

    itemsValidator(payload) {
        if (!this.isInfinite) return payload;
        let { visibleColumns, visibleRows } = this;
        let validatedItems = payload;

        if (!validatedItems) {
            return [];
        }

        const minFullScreens = 3;
        let visibleCels = visibleColumns * visibleRows;
        let minCelsAmountForSlider = visibleCels * minFullScreens;

        if (validatedItems.length >= minCelsAmountForSlider)
            return validatedItems;

        let diff = minCelsAmountForSlider - validatedItems.length;
        while (validatedItems.length < minCelsAmountForSlider) {
            validatedItems = validatedItems.concat(
                validatedItems.slice(0, diff)
            );
        }
        return validatedItems;
    }

    columnsCreator() {
        let { validItems, visibleRows, visibleColumns } = this;
        this.validColumns = [];
        let i = 0;

        while (i < validItems.length) {
            let column = (validItems.slice(i, i + visibleRows));
            this.validColumns.push(column);
            i += visibleRows;
        }

        if (!this.isSlider || !this.isInfinite) {
            return
        };

        this.validColumns = this.validColumns
            .slice(this.validColumns.length - visibleColumns)
            .concat(
                this.validColumns.slice(
                    0,
                    this.validColumns.length - visibleColumns
                )
            );
    }

    cssPositionsCreator() {
        for (let i = 0; i < this.validColumns.length; i++) {
            this.allCSSpositions.push(i * -1 * (100 / this.props.columns));
        }
    }

    render() {

        let sliderProps = {
            validColumns: this.state.validColumns,
            visibleColumns: this.visibleColumns,
            isSlider: this.isSlider
        };
        return (
            <div style={{ position: 'relative' }}>
                <Carousel
                    {...sliderProps}
                    changeLogicalPosition={this.animatingAdjustSliderToNewPosition}
                    sliderRef={(context) => { this.sliderRef = context }}
                    left={this.allCSSpositions[this.logicalPosition] + '%'}
                    transition={this.state.transition}
                    clickOnColumnHandler = { this.clickOnColumnHandler }
                />

                {this.hasNavigators ? (
                    <Switchers
                        by={sliderProps.visibleColumns}
                        changeLogicalPosition={this.animatingAdjustSliderToNewPosition}
                    />
                ) : null}
            </div>
        );
    }

    __focusify__WHEN_CURRENT__keyboardHandler(e) {
        let { columns } = this.props;
        if (e.key === 'ArrowLeft') {
            this.animatingAdjustSliderToNewPosition(-1, columns);
        } else if (e.key === 'ArrowRight') {
            this.animatingAdjustSliderToNewPosition(1, columns);
        }
    }
}

export default focusify(Root);
