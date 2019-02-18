import React, { Component } from 'react';
import { PropsClone } from './propsClone';
import { StateClone } from './stateClone';
import { References } from './references';
import { Actions } from './../libraries/actions';
import { arrayOperations } from '../libraries/arrayOperations';
import { propsValidation } from '../libraries/propsValidation';

const provider = WrapperComponent =>
    class extends Component {
        constructor(props) {
            super(props);
            this.validatePropsSettings =this.validatePropsSettings.bind(this)
            this.validatePropsSliders = this.validatePropsSliders.bind(this)
            this.propsClone = new PropsClone(this);
            this.stateClone = new StateClone(this);
            this.references = new References(this);
            this.actions = new Actions(this);
        }

        componentWillMount() {
            if (this.props.hoistMyContext) this.props.hoistMyContext(this);
            this.validateProps();
        }


        componentWillUpdate() {
            this.validateProps();
        }

        validateProps() { 
            let { sliders, settings } = this.props; 
            if (!settings || !sliders || sliders.length < 1 || sliders[0].items.length < 1) {
                this.nothingToRender = true;
                return;
            }
            this.validatePropsSettings();
        }

        validatePropsSettings() {
            let { sliders, settings } = this.props; 

            if (!settings || !sliders || sliders.length < 1 || sliders[0].length < 1) {
                this.nothingToRender = true;
                return;
            }

            let { duration, rows, navigators, infinite } = settings;

            this.propsClone.settings = {
                duration: duration,
                rows: rows && rows > 0 ? rows : 1,
                navigators: navigators ? navigators : true,
                infinite: propsValidation.isInfinite(sliders, this.rows, infinite),
                leftOverflow: propsValidation.leftOverflow(sliders),
                maxRightPosition: propsValidation.maxRightPosition(sliders)
            }

            this.validatePropsSliders(); 
        }

        validatePropsSliders() {
            let { sliders } = this.props;
            
            this.propsClone.sliders = []; 
            for (let i = 0; i < sliders.length; i++) {
                this.propsClone.sliders.push(this.validatePropsForEverySlider(sliders[i], i));
            }
        }

        validatePropsForEverySlider(sliderObject, i) { 
            let { items, columns } = sliderObject;
            let { rows, infinite, leftOverflow } = this.propsClone.settings;
            
            let sliderValidatedObject = {
                columns: columns,
                slider: propsValidation.isSlider(items, columns, rows),
                validColumns: this.validateItemsForSlider(items, leftOverflow, rows, infinite, this.slider),
                shiftBy: 100 / this.columns,
                initialPosition: infinite && this.slider ? leftOverflow : 0,
                individualMaxRight: this.validColumns.length - this.columns
            }

            return sliderValidatedObject;
        }

        validateItemsForSlider(items, leftOverflow, rows, infinite, isSlider) {
            let minFullViewsAmount = infinite && isSlider ? 3 : null;
            let validItems = arrayOperations.itemsAmountValidator(items, leftOverflow, rows, minFullViewsAmount);
            let validColumns = arrayOperations.columnsArrayCreator(validItems, rows);
            if (infinite) {
                validColumns = arrayOperations.columnsArrayRebuild(validColumns, validColumns.length - leftOverflow);
            } 
            return validColumns;
        }

        render() {

            if (this.nothingToRender) {
                return null;
            }

            return <WrapperComponent
                propsClone={this.propsClone}
                stateClone={this.stateClone}
                references={this.references}
                actions={this.actions} />
        }
    };

export default provider
