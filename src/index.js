import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import "./styles.css";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
//import Spinner from 'react-bootstrap/Spinner'

const StyledTable = styled(ReactTable)`
  padding: 1rem;
  .rt-td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    border-top: 1px solid #333;
    border-right: 1px solid #333 !important;
    border-left: 1px solid #333 !important;
    color: white

    :last-child {
      border-right: 0;
    }
  }

  .rt-noData {
    visibility: hidden;
  }

  .rt-noData:after {
    content: 'goodbye';
  }

  .rt-th {
    border-bottom: 1px solid #333;
    border-top: 1px solid #333;
    border-right: 1px solid #333 !important;
    border-left: 1px solid #333 !important;
    color: white

    :last-child {
      border-right: 0;
    }
  }

  .remove {
    border: 0;
    background-color: white;
    text-align: right;
    font-weight: 700;
    flex: 0 0 20px;
    
    a {
      text-decoration: none;
      color: black;
    }
  }
`;



const URL = "https://mata-api.herokuapp.com";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      text: "",
      data: [],
      isLoading: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    //this.initData();
  }

  async componentDidMount(prevProps, prevState) {
    this.state.data = await this.getInitStockData();
    await this.initData();
  }

  async getInitStockData() {
    const response = await fetch(`${URL}/treasure/getData`);
    return response.json();
  }

  async callStockApi(code) {
    const response = await fetch(`${URL}/treasure?code=${code}`);
    return response.json();
  }

  async callAddStock(data) {
    await fetch(`${URL}/treasure`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    this.initData();
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.data];
    console.log(event.target.value);
    data[cellInfo.index][cellInfo.column.id] = event.target.value;

    this.setState({ data });
  };

  renderEditable = (cellInfo) => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];

    return (
      <input
        placeholder="type here"
        name="input"
        type="text"
        style={{
          color: "white",
          backgroundColor: "black"
        }}
        onChange={this.handleInputChange.bind(null, cellInfo)}
        value={cellValue}
      />
    );
  };

  updateStock = () => {
    console.log(this.state.data);
    this.callAddStock(this.state.data);
  };

  remove = (row) => {
    // Array.prototype.filter returns new array
    // so we aren't mutating state here
    let data = this.state.data;
    console.log(this.state.data[row.index]);
    data.splice(row.index, 1)
    this.setState({data})
  };

  async initData() {
    this.state.data.forEach((e) => {
      console.log(e.code);
      var index = this.state.data.findIndex((obj) => obj.code === e.code);
      this.callStockApi(e.code).then((data) => {
        this.state.data[index].currentPrice = data.Price;
        this.state.data[index].currentChange = data.Change;
        this.state.data[index].currentPerChange = data.PerChange;
        this.state.data[index].change =
          data.Price - this.state.data[index].initPrice;
        this.state.data[index].perChange = ((this.state.data[index].change / parseInt(this.state.data[index].initPrice)) * 100).toFixed(2);
        console.log(this.state.data[index].perChange);
        this.setState({ data: this.state.data });
        this.setState({ loading: false });
      });
    });
  }

  setText = (e) => {
    this.setState({ text: e.target.value });
  };

  totalProfit = () => {
    console.log(this.state.data)
    const totalProfit = this.state.data.reduce((a, b) => a + (parseFloat(b['perChange']) || 0), 0);
    return totalProfit
  }

  addStock = async () => {
    try {
      var elStockCode = document.getElementById("stockCode");
      var elInputInitPrice = document.getElementById("inputInitPrice");
      var stockCode = elStockCode.value;
      if (stockCode === "") {
        elStockCode.focus();
        return;
      }
      var stockData = await this.callStockApi(stockCode);
      console.log(stockData);
      var inputInitPrice = elInputInitPrice.value;
      var initPrice =
        elInputInitPrice.value === "" ? stockData.Price : inputInitPrice;
      var change = stockData.Price - initPrice;

      var object = {
        code: stockCode,
        addedDate: new Date().toLocaleDateString(),
        initPrice: parseInt(initPrice),
        currentPrice: stockData.Price,
        currentChange: stockData.Change,
        currentPerChange: stockData.PerChange,
        change: change,
        perChange: (parseInt(change) / parseInt(initPrice)).toFixed(4) * 100
      };
      console.log("aaa");
      console.log(object);
      this.state.data.push(object);
      this.setState({ data: this.state.data });
      await this.callAddStock(this.state.data);

      elStockCode.value = "";
      elInputInitPrice.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { data, isLoading } = this.state;
    return (
      <>
        <div className="App">
          <input
            placeholder="Code"
            id="stockCode"
            value={this.state.text}
            onChange={this.setText}
          />
          <input placeholder="Init Price" id="inputInitPrice" type="text" />
          <button
            style={{
              width: "150px",
              height: "21px"
            }}
            type="submit"
            onClick={this.addStock}
          >
            Add
          </button>
          <button
            style={{
              width: "150px",
              height: "21px"
            }}
            type="submit"
            onClick={this.updateStock}
          >
            Update
          </button>
        </div>
        {
          <div>
            <StyledTable
              style={{
                backgroundColor: "black",
                color: "white"
              }}
              data={data}
              columns={[
                {
                  Header: "Remove",
                  Cell: (row)=> (
                    <span style={{cursor:'pointer',color:'red',textDecoration:'underline'}}
                          onClick={() => {
                              let data = this.state.data;
                              console.log(this.state.data[row.index]);
                              data.splice(row.index, 1)
                              this.setState({data})
                              console.log(data)
                              this.callAddStock(data)
                            }}>
                              Delete
                            </span> 
                    )
                },
                {
                  Header: "Code",
                  accessor: "code"
                },
                {
                  Header: "Added Date",
                  accessor: "addedDate"
                },
                {
                  Header: "Init Price",
                  accessor: "initPrice",
                  Cell: this.renderEditable
                },
                {
                  Header: "Current Price",
                  accessor: "currentPrice",
                  getProps: (state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        style: {
                          color:
                            rowInfo.row.currentChange >= 0 ? "#0f0" : "#ff3737"
                        }
                      };
                    }
                    return {};
                  }
                },
                {
                  Header: "Current Change",
                  accessor: "currentChange",
                  getProps: (state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        style: {
                          color:
                            rowInfo.row.currentChange >= 0 ? "#0f0" : "#ff3737"
                        }
                      };
                    }
                    return {};
                  }
                },
                {
                  Header: "Current Per Change",
                  accessor: "currentPerChange",
                  Cell: (props) => <span>{props.value}%</span>,
                  getProps: (state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        style: {
                          color:
                            rowInfo.row.currentChange >= 0 ? "#0f0" : "#ff3737"
                        }
                      };
                    }
                    return {};
                  }
                },
                {
                  Header: "Change",
                  accessor: "change",
                  getProps: (state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        style: {
                          color: rowInfo.row.change >= 0 ? "#0f0" : "#ff3737"
                        }
                      };
                    }
                    return {};
                  }
                },
                {
                  Header: "PerChange",
                  accessor: "perChange",
                  id: "perChange",
                  Cell: (props) => <span>{props.value}%</span>,
                  getProps: (state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                      return {
                        style: {
                          color: rowInfo.row.change >= 0 ? "#0f0" : "#ff3737"
                        }
                      };
                    }
                    return {};
                  },
                  Footer: (
                    <span style={{color:  "#0f0"}}>{
                      data.reduce((total, { perChange }) => total += parseFloat(perChange), 0)
                    }%</span>
                  )
                }
              ]}
              className="-striped -highlight"
            />
          </div>
        }
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);