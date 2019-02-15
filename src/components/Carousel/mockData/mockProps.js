import {mockData} from './mockData';
import React, { Component } from 'react';

export let mockProps = () => {
    
    return mockData.map((item, id) => {

        let SomeComponentFromProvidedData = (props) => {
            let styles;
            if (props.columnIndex === 0) {
                styles = {
                    width: '100%',
                    height: 240,
                    border: 'solid 1px black',
                    background: 'green',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            } else {
                styles = {
                    width: '100%',
                    height: 240,
                    border: 'solid 1px black',
                    background: 'blue',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }

            return (
                <div
                    style={styles}
                    key={id}>
                    {item.title}
                </div>
            )
        }

        return SomeComponentFromProvidedData

    })
}