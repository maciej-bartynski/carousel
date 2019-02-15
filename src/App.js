import React, { Component } from 'react';
import Carousel from './components/Carousel/index';
import { mockProps } from './components/Carousel/mockData/mockProps';
let sad = mockProps();
let sad2 = mockProps();
class App extends Component {

  render() { console.log('asdfasdf')

    let config = {

      settings: {
        duration: 300,
      },

      sliders: [{
        items: sad,
        columns: 1,
        rows: 1,
        slider: true,
        infinite: true,
        navigators: true,
        transitionProperty: 'left',
        transitionTiming: 'linear',
        transitionStart: 'none',
        transitionEnd: 'none',
      },{
        items: sad2,
        columns: 3,
        rows: 2,
        slider: true,
        infinite: true,
        navigators: true,
        transitionProperty: 'left',
        transitionTiming: 'linear',
        transitionStart: 'none',
        transitionEnd: 'none',
      }]
    }

    let config2 = {

      settings: {
        duration: 300,
      },

      sliders: [{
        items: sad,
        columns: 1,
        rows: 1,
        slider: true,
        infinite: true,
        navigators: true,
        transitionProperty: 'left',
        transitionTiming: 'linear',
        transitionStart: 'none',
        transitionEnd: 'none',
      },{
        items: sad2,
        columns: 3,
        rows: 2,
        slider: true,
        infinite: true,
        navigators: true,
        transitionProperty: 'left',
        transitionTiming: 'linear',
        transitionStart: 'none',
        transitionEnd: 'none',
      }]
    }

    return (

      <div style={{ margin: '0 auto', width: '70%' }}>
  <Carousel {...config2} />
        <Carousel {...config} />

        <Carousel {...config2} />

      </div>
    );
  }
}

export default App;
