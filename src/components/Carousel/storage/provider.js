import React, { Component } from 'react';
import { ValidatedProps } from './props';
import { StateClone } from './state';
import { References } from './references';
import { Actions } from './../libraries/actions';

const provider = WrapperComponent =>
    class extends Component {
        componentWillMount(){
            if(this.props.hoistMyContext) this.props.hoistMyContext(this)
        }
        render() {
            this.validatedProps = new ValidatedProps(this);
            this.stateClone = new StateClone(this);
            this.references = new References(this);
            this.actions = new Actions(this)
            let { props } = this;

            return <WrapperComponent
                {...props}
                validatedProps={this.validatedProps}
                stateClone={this.stateClone}
                references={this.references} 
                actions={this.actions} />
        }
    };

export default provider
