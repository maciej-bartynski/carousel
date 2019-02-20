import React, { Component } from 'react';
import { PropsClone } from './propsClone';
import { StateClone } from './stateClone';
import { References } from './references';
import { Actions } from './../libraries/actions';
import { arrayOperations } from '../libraries/arrayOperations';
import { propsValidation } from '../libraries/propsValidation';
import Placeholder from '../elements/placeholder';

const provider = WrapperComponent =>
    class extends Component {
        constructor(props) {
            super(props);
            this.validatePropsSettings = this.validatePropsSettings.bind(this)
            this.validatePropsSliders = this.validatePropsSliders.bind(this)
            this.propsClone = new PropsClone(this);
            this.stateClone = new StateClone(this);
            this.references = new References(this);
            this.actions = new Actions(this);
            this.state = {
                propsClone: {
                    settings: {
                        duration: 300,
                        rows: 1,
                        navigators: true,
                        infinite: false,
                        leftOverflow: 0,
                        maxRightPosition: 4,
                        autoplay: false,
                        autoplayDuration: false,
                    },

                    sliders: [{
                        items: [<Placeholder />, <Placeholder />, <Placeholder />, <Placeholder />, <Placeholder />],
                        columns: 1,
                        individualMaxRight: 4,
                        initialPosition: 0,
                        individualCurrenPosition: null,
                        validColumns: []
                    }, {
                        items: [<Placeholder />, <Placeholder />, <Placeholder />, <Placeholder />, <Placeholder />],
                        columns: 3,
                        individualMaxRight: 2,
                        initialPosition: 0,
                        individualCurrenPosition: null,
                        columnNavi: true,
                        validColumns: []
                    }]
                },
                stateClone: this.stateClone,
                actions: this.actions,
                references: this.references,
            }
        }

        componentWillMount() {
            this.validateProps();
            this.setState({
                propsClone: this.propsClone
            })
        }

        componentWillReceiveProps(){
            this.validateProps();
            this.setState({
                propsClone: this.propsClone
            })
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

            let { duration, rows, navigators, infinite, autoplay, autoplayDuration } = settings;

            let settingsValidatedObject_partA = {
                duration: duration,
                rows: rows && rows > 0 ? rows : 1,
                navigators: navigators ? navigators : true,
                leftOverflow: propsValidation.leftOverflow(sliders),
                maxRightPosition: propsValidation.maxRightPosition(sliders),
                autoplay: autoplay ? autoplay : false,
                autoplayDuration: autoplayDuration && autoplayDuration > 0 ? autoplayDuration : 15000,
            }

            let settingsValidatedObject_partB = {
                infinite: propsValidation.isInfinite(sliders, settingsValidatedObject_partA.rows, infinite),
            }

            let settingsValidatedObject = {
                ...settingsValidatedObject_partA,
                ...settingsValidatedObject_partB
            }

            this.propsClone.settings = settingsValidatedObject;
            this.stateClone.currentRootPosition = infinite ? this.propsClone.settings.leftOverflow : 0; 

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

            let { items, columns, columnNavi } = sliderObject;
            let { rows, infinite, leftOverflow } = this.propsClone.settings;
            let its = this;

            /**
             * calculate values dependent
             * on each others in scope 
             * of single object makes necessary
             * to cut this object into three scopes first
             */
            let sliderValidatedObject_partA = {
                columns: columns,
                slider: propsValidation.isSlider(items, columns, rows),
                shiftBy: 100 / columns,
            }

            let sliderValidatedObject_partB = {
                validColumns: its.validateItemsForSlider(items, leftOverflow, rows, infinite, sliderValidatedObject_partA.slider),
                initialPosition: infinite && sliderValidatedObject_partA.slider ? leftOverflow : 0,
            }

            let sliderValidatedObject_partC = {
                individualMaxRight: sliderValidatedObject_partB.validColumns.length - sliderValidatedObject_partA.columns,
                columnNavi: propsValidation.hasColumnNavi( sliderValidatedObject_partA.slider, columnNavi )
            }

            let sliderValidatedObject = {
                ...sliderValidatedObject_partA,
                ...sliderValidatedObject_partB,
                ...sliderValidatedObject_partC
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

            this.references.provider = this;

            return <WrapperComponent
                propsClone={this.state.propsClone}
                stateClone={this.state.stateClone}
                references={this.state.references}
                actions={this.state.actions} />
        }
    };

export default provider
