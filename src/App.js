import React, { Component } from 'react';
import Carousel from './components/Carousel/index';
import { mockProps } from './components/Carousel/mockData/mockProps';
let sad = mockProps();
let sad2 = mockProps();
class App extends Component {

  constructor(props) {
    super(props);
    this.changeprops = this.changeprops.bind(this);
    this.state = {
      config: {
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
        }, {
          items: sad2,
          columns: 3,
          columnNavi: true
        }]
      }
    }
  }

  changeprops() {
    this.setState(
      {
        config: {
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
            columns: 2,
          }, {
            items: sad2,
            columns: 5,
            columnNavi: true
          }]
        }
      }
    )

  }


  render() {
    return (

      <div style={{ margin: '0 auto', width: '70%' }}>

        <Carousel {...this.state.config} hoistMyContext={(x) => this.cont = x} />

        <button onClick={e => this.changeprops()}>change props</button>

      </div>
    );
  }
}

export default App;
