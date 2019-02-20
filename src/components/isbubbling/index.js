import React from 'react';

export default class Compo extends React.Component {
    constructor(props){
        super(props);
        this.reddd = React.createRef();
        this.focusHandler = this.focusHandler.bind(this);
    }

    focusHandler(){

    }

    render(){
        return(
            <div
                ref={this.reddd}
                tabIndex={0}
                tabbable={true}
                onFocus={focusHandler}
                style={{ width: 300, height: 300, border: 'solid 1px red' }}    
            >
                <button>clickme</button>
            </div>
        )
    }
}