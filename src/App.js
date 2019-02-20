import React, { Component } from 'react';
import Carousel from './components/Carousel/index';
import { mockProps } from './components/Carousel/mockData/mockProps';
let sad = mockProps();
let sad2 = mockProps();
class App extends Component {

  render() { 

    let config = {

      settings: {
        duration: 300,
        rows: 0,
        navigators: true,
        infinite: true,
        autoplay: true,
        autoplayDuration: 6000
      },

      sliders: [{
        items: sad,
        columns: 1,
      },{
        items: sad2,
        columns: 3,
        columnNavi: true
      }]
    }

    return (

      <div style={{ margin: '0 auto', width: '70%' }}>
        
        <Carousel {...config} hoistMyContext ={ (x)=>this.cont=x } />
        
      </div>
    );
  }
}

export default App;
