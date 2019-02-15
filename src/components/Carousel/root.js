import React, { Component } from 'react';
import focusify from '../../focusify/focusable';
import defaultClasses from './rootcss';
import classify from '../../classify';
import Slider from './elements/slider';
import { arrayOperations } from './libraries/arrayOperations';
import { propsValidation } from './libraries/propsValidation';
import { validatedProps } from './storage/props';

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            renderableColumns: null
        };
        this.validateProps();
    }

    componentWillMount() {
        this.props.__focusify__SET_ME_AS__controlledComponent(this);
    }

    validateProps() {
        let { sliders, settings } = this.props;
        validatedProps.settings.duration = settings.duration;
        if (sliders.length > 1) {
            let leftOverflow = sliders.map((slider) => {
                return slider.columns
            }).sort((a, b) => {
                return b - a;
            })[0]
            validatedProps.leftOverflow = leftOverflow;
        }

        for (let i = 0; i < sliders.length; i++) {
            this.validatePropsForEverySlider(sliders[i], i)
        }
    }

    validatePropsForEverySlider(config, idx) {
        let items = config.items;
        let rowsAmount = config.rows && config.rows !== 0 ? config.rows : 1;
        validatedProps.sliders[idx] = {};
        validatedProps.sliders[idx].columns = config.columns;
        validatedProps.sliders[idx].rows = idx > 0 ? 1 : rowsAmount;
        validatedProps.sliders[idx].slider = propsValidation.isSlider(
            items, config.columns, config.rows
        );
        validatedProps.sliders[idx].infinite = propsValidation.isInfinite(
            validatedProps.sliders[idx].slider, config.infinite
        );
        let { columns, rows, infinite } = validatedProps.sliders[idx];
        let minFullViewsAmount = infinite ? 3 : null;
        let validItems = arrayOperations.itemsAmountValidator(items, validatedProps.leftOverflow, rows, minFullViewsAmount);
        let validColumns = arrayOperations.columnsArrayCreator(validItems, rows);
        if (infinite) {
            validColumns = arrayOperations.columnsArrayRebuild(validColumns, validColumns.length - validatedProps.leftOverflow);
        }
        validatedProps.sliders[idx].validColumns = validColumns;
        this.state.position = infinite ? validatedProps.leftOverflow : 0;
    }

    getContent() {
        return validatedProps.sliders.map((config, idx) => {
            return (
                <Slider
                    key={idx}
                    id={idx}
                    renderableColumns={config.validColumns}
                    position={this.state.position}
                />
            )
        })
    }

    render() {
        return (
            <div className={'wrapper'}>
                {this.getContent()}
            </div>
        )
    }

    changePosition(payload){
        this.setState(payload);
    }

    __focusify__WHEN_CURRENT__keyboardHandler(e) {
        if (e.key === 'ArrowLeft') {
            this.setState({ string: e.key });
        } else if (e.key === 'ArrowRight') {
            this.setState({ string: e.key });
        }
    }
}


export default focusify(classify(defaultClasses)(Root));
export let rootComponentState = Root.changePosition ;