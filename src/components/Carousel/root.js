import React, { Component } from 'react';
import focusify from '../../focusify/focusable';
import defaultClasses from './rootcss';
import classify from '../../classify';
import Slider from './elements/slider';
import provider from './storage/provider';
import { string, shape } from 'prop-types';
import { ClickOrSwipe } from './storage/clickOrSwipe';

class Root extends Component {
    static propTypes = {
        classes: shape({
            wrapper: string
        })
    }

    constructor(props) {
        super(props);
        this.rootNode = React.createRef();
        this.onNavigatorClick = this.onNavigatorClick.bind(this);
    }

    componentWillMount() {
        this.props.__focusify__SET_ME_AS__controlledComponent(this);
        this.props.references.rootContextRef = this;
    }

    componentWillUnmount() {
        this.props.references.rootContextRef = null;
        this.props.references.rootNodeRef = null;
    }

    componentDidMount() {
        this.props.references.rootNodeRef = this.rootNode;

        let { actions } = this.props;
        actions.onAutoplay();
    }

    getContent() {
        let { propsClone, references, stateClone, actions } = this.props;

        return this.props.propsClone.sliders.map((slider, idx) => {
            let clickOrSwipe = new ClickOrSwipe();
            return (
                <Slider
                    key={idx}
                    id={idx}

                    propsClone={propsClone}
                    references={references}
                    stateClone={stateClone}
                    actions={actions}
                    clickOrSwipe={clickOrSwipe}
                />
            )
        })
    }

    render() {

        let { classes, actions } = this.props;

        return (
            <div>
                <div ref={this.rootNode} className={'wrapper'}>
                    {this.getContent()}
                </div>
                <button onClick={() => this.onNavigatorClick(-1)}>Left</button>
                <button onClick={() => this.onNavigatorClick(1)}>Right</button>
                <br/>
                <button onClick={() => this.onNavigatorClick(-1, true)}>LeftByView</button>
                <button onClick={() => this.onNavigatorClick(1, true)}>RightByView</button>
                <br/>
                <button onClick={() => this.onNavigatorClick(1, false, true)}>Go to 2</button>
            </div>
        )
    }
    
    onNavigatorClick(dir, view, to){
        let { actions } = this.props;
        if (view){
            actions.onShiftBy(dir, null, true);
            return;
        }
        if(to){
            actions.onShiftTo(2);
            return;
        }
        actions.onShiftBy(dir, 1);
    }
    
    __focusify__WHEN_CURRENT__keyboardHandler(e) {
        if (e.key === 'ArrowLeft') {
            //    this.setState({ string: e.key });
        } else if (e.key === 'ArrowRight') {
            //    this.setState({ string: e.key });
        }
    }
}

export default provider(focusify(classify(defaultClasses)(Root)));