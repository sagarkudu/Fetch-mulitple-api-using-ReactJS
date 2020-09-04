import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.state={
      data17: null,
      data18: null,
      resultData: null
    }
  }

  //we should call all api in componentDidMount, because html content will until data is loaded.
  componentDidMount() {
    let prom17 = fetch('http://data.fixer.io/api/2017-01-01?access_key=401b813f53bc48488e308cb9a13e06fb');
    let prom18 = fetch('http://data.fixer.io/api/2018-01-01?access_key=401b813f53bc48488e308cb9a13e06fb');


    // let resultArr = [
    //       {
    //       countryCode: "XYZ",
    //       value17: 10.2,
    //       value18: 22.22,
    //       perDiff: 2.01 // Calculate3d value
    //     },
    //     {
    //       countryCode: "ABC",
    //       value17: 50.2,
    //       value18: 26.22,
    //       perDiff: 1.01 // Calculate3d value
    //     }
    //   ];

    Promise.all([prom17, prom18]).then((resp) => {

      let textDataArr = [];
      
      if(resp && resp.length > 0) {
        textDataArr.push(resp[0].json());
        // .then((result) => {
        //   //put this data into state
        //   this.setState({data17:result.rates});
        // })
      }

      if(resp && resp.length > 1) {
        textDataArr.push(resp[1].json());
        // resp[1].json().then((result) => {
        //   //put this data into state
        //   this.setState({data18:result.rates});
        // })
      }
      if(textDataArr && textDataArr.length) {
        this.createDataObject(textDataArr);
      }
    })
  }

createDataObject = (promData) => {
    Promise.all(promData).then((resolvedDataArr) => {
      this.setState({data17:resolvedDataArr[0].rates});
      this.setState({data18:resolvedDataArr[1].rates});

      let res = Object.keys(this.state.data17).map((key) => {
        return {
          countryCode: key,
          value17: this.state.data17[key].toFixed(2),
          value18: this.state.data18[key].toFixed(2),
          perDiff: (this.state.data18[key] - this.state.data17[key]/(this.state.data17[key] * 100)).toFixed(2) // Calculate3d value
        };
      });
      res.sort(function(a,b){return a.perDiff-b.perDiff});
      this.setState({resultData: res});
    });
  }

  render() {
    return <>
      <div className="App">
      <h1>Fetch Currency API</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>2017</th>
            <th>2018</th>
            <th>Per Change</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.resultData ?
            this.state.resultData.map ((item) => 
            <tr>
              <td>{item.countryCode}</td>
              <td>{item.value17}</td>
              <td>{item.value18}</td>
              <td>{item.perDiff}</td>
            </tr>
            )
            :
            null
          }
        </tbody>
      </table>
      </div>
    </>
  }
}

export default App;
