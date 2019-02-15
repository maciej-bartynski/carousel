import React, { Component } from 'react';
import focusify from '../../focusify/focusable';
import defaultClasses from './rootcss';
import classify from '../../classify';
import Slider from './elements/slider';
import { arrayOperations } from './libraries/arrayOperations';
import { propsValidation } from './libraries/propsValidation';

import provider from './storage/provider';

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            renderableColumns: null
        };
        this.validateProps();
        this.rootNode = React.createRef();
    }

    componentWillMount() {
        this.props.__focusify__SET_ME_AS__controlledComponent(this);
        this.props.references.rootReference = this;
    }

    componentDidMount(){
        this.props.references.rootNode = this.rootNode;
    }

    validateProps() {
        let { sliders, settings } = this.props;
        this.props.validatedProps.settings.duration = settings.duration;
        this.props.validatedProps.maxFullScreen = sliders[0].columns;
        this.props.validatedProps.leftOverflow = sliders[0].columns;
        if (sliders.length > 1) {
            let leftOverflow = sliders.map((slider) => {
                return slider.columns
            }).sort((a, b) => {
                return b - a;
            })
            this.props.validatedProps.leftOverflow = leftOverflow[0];
            this.props.validatedProps.maxFullScreen = leftOverflow[sliders.length - 1];
        }

        for (let i = 0; i < sliders.length; i++) {
            this.validatePropsForEverySlider(sliders[i], i)
        }
    }

    validatePropsForEverySlider(config, idx) {
        let items = config.items;
        let rowsAmount = config.rows && config.rows !== 0 ? config.rows : 1;
        this.props.validatedProps.sliders[idx] = {};
        this.props.validatedProps.sliders[idx].columns = config.columns;
        this.props.validatedProps.sliders[idx].rows = idx > 0 ? 1 : rowsAmount;
        this.props.validatedProps.sliders[idx].slider = propsValidation.isSlider(
            items, config.columns, config.rows
        );
        this.props.validatedProps.sliders[idx].infinite = propsValidation.isInfinite(
            this.props.validatedProps.sliders[idx].slider, config.infinite
        );
        let { rows, infinite } = this.props.validatedProps.sliders[idx];
        let minFullViewsAmount = infinite ? 3 : null;
        let validItems = arrayOperations.itemsAmountValidator(items, this.props.validatedProps.leftOverflow, rows, minFullViewsAmount);
        let validColumns = arrayOperations.columnsArrayCreator(validItems, rows);
        if (infinite) {
            validColumns = arrayOperations.columnsArrayRebuild(validColumns, validColumns.length - this.props.validatedProps.leftOverflow);
        }
        this.props.validatedProps.sliders[idx].validColumns = validColumns;
        this.state.position = infinite ? this.props.validatedProps.leftOverflow : 0;

        this.props.stateClone.position = this.state.position;
        this.props.stateClone.maxRight = validColumns.length - this.props.validatedProps.leftOverflow;
    }

    getContent() {
        let {validatedProps, references, stateClone, actions} = this.props;
        return this.props.validatedProps.sliders.map((config, idx) => {
            return (
                <Slider
                    key={idx}
                    id={idx}
                    renderableColumns={config.validColumns}
                    position={this.state.position}

                    validatedProps={validatedProps}
                    references={references}
                    stateClone={stateClone}
                    actions={actions}
                />
            )
        })
    }

    render() {
        return (
            <div>
                <div
                    ref={this.rootNode} 
                    className={'wrapper'}>
                    {this.getContent()}
                </div>
                <button onClick={() => this.props.actions.onButtonClick(-1)}>Left</button>
                <button onClick={() => this.props.actions.onButtonClick(1)}>Right</button>
            </div>
        )
    }

    changePosition(payload) {
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

export default provider(focusify(classify(defaultClasses)(Root)));