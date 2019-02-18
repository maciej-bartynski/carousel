import React, { Component } from 'react';
import Carousel from './components/Carousel/index';
import { mockProps } from './components/Carousel/mockData/mockProps';
let sad = mockProps();
let sad2 = mockProps();
class App extends Component {

  render() { console.log('asdasd')

    let config = {

      settings: {
        duration: 300,
        rows: 1,
        navigators: true,
        infinite: false,
      },

      sliders: [{
        items: sad,
        columns: 1,
      },{
        items: sad2,
        columns: 3,
      }]
    }

    return (

      <div style={{ margin: '0 auto', width: '70%' }}>
        
        <Carousel {...config} hoistMyContext ={ (x)=>this.cont=x } />
        <button onClick={
          ()=>this.goTo(4)
        }>special</button>
      </div>
    );
  }



  componentDidMount(){
    //this.goTo = this.cont.actions.onColumnClick;
  }
}

export default App;
