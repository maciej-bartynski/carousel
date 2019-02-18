import React, { Component } from 'react';
import focusify from '../../focusify/focusable';
import defaultClasses from './rootcss';
import classify from '../../classify';
import Slider from './elements/slider';
import provider from './storage/provider';
import { string, shape } from 'prop-types';

class Root extends Component {
    static propTypes = {
        classes: shape({
            wrapper: string
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            renderableColumns: this.props.propsClone.sliders.map(slider=> slider.validColumns)
        };
        this.rootNode = React.createRef();
    }

    componentWillMount() {
        this.props.__focusify__SET_ME_AS__controlledComponent(this);
        this.props.references.rootContextRef = this;
    }

    componentDidMount() {
        this.props.references.rootNodeRef = this.rootNode;
    }

    getContent() {
        let { propsClone, references, stateClone, actions } = this.props;
        return this.props.propsClone.sliders.map((slider, idx) => {
            return (
                <Slider
                    key={idx}
                    id={idx}
                    renderableColumns={this.state.renderableColumns[idx].validColumns}
                    position={slider.initialPosition}

                    propsClone={propsClone}
                    references={references}
                    stateClone={stateClone}
                    actions={actions}
                />
            )
        })
    }

    render() {

        let { classes, actions } = this.props;

        return (
            <div>
                <div
                    ref={this.rootNode}
                    className={'wrapper'}>
                    {this.getContent()}
                </div>
                <button onClick={() => this.actions.onNavigatorClick(-1)}>Left</button>
                <button onClick={() => this.actions.onNavigatorClick(1)}>Right</button>
            </div>
        )
    }

    //changePosition(payload) {
    //    this.setState(payload);
    //}

    __focusify__WHEN_CURRENT__keyboardHandler(e) {
        if (e.key === 'ArrowLeft') {
            //    this.setState({ string: e.key });
        } else if (e.key === 'ArrowRight') {
            //    this.setState({ string: e.key });
        }
    }
}

export default provider(focusify(classify(defaultClasses)(Root)));