import React, { Component } from 'react';

const classify = DefaultClasses => WrappedComponent =>
    class extends Component {

        render() {
            let { ...restProps } = this.props;

            return (
                <DefaultClasses>
                    <WrappedComponent {...restProps} />
                </DefaultClasses>
            );
        }
    };

export default classify;
