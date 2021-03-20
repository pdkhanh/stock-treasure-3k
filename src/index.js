import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { StyledTable } from "./style/StyledTable"

import "react-table/react-table.css";
import { APIUtils } from "./APIUtils";
//import Spinner from 'react-bootstrap/Spinner'


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: [],
      isLoading: true,
    };
  }

  async componentDidMount(prevProps, prevState) {
    this.state.data = await APIUtils.getInitStockData();
    this.setState({ data: this.state.data });
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.data];
    console.log(event.target.value);
    data[cellInfo.index][cellInfo.column.id] = parseInt(event.target.value);

    this.setState({ data });
  };

  renderEditable = (cellInfo) => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];
    return (
      <input
        placeholder="Type here"
        name="input"
        type="text"
        style={{
          color: "white",
          backgroundColor: "black"
        }}
        onChange={this.handleInputChange.bind(null, cellInfo)}
        value={parseInt(cellValue)}
      />
    );
  };

  updateStock = async () => {
    var response = await APIUtils.updateStock(this.state.data);
    this.setState({ data: response });
  };

  addStock = async () => {
    var stockData = {
      code: document.getElementById("stockCode").value,
      initPrice: document.getElementById("inputInitPrice").value === "" ? 0 : document.getElementById("inputInitPrice").value,
      addedDate: new Date().toLocaleDateString()
    }

    var response = await APIUtils.addStock(stockData)
    this.state.data.push(response)
    this.setState({ data: this.state.data });
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <>
        <div
          style={{
            backgroundColor: "black"
          }}
          className="App">
          <input style={{
            background: "black",
            color: "#0f0",
            width: "150px",
            height: "27px",
          }}
            placeholder="Code"
            id="stockCode"
          />
          <input
            style={{
              backgroundColor: "black",
              color: "#0f0",
              width: "150px",
              height: "27px"
            }}
            placeholder="Init Price" id="inputInitPrice" type="text" />
          <button
            style={{
              backgroundColor: "black",
              color: "#0f0",
              width: "150px",
              height: "32px"
            }}
            type="submit"
            onClick={this.addStock}
          >
            Add
          </button>
          <button
            style={{
              backgroundColor: "black",
              color: "#0f0",
              width: "150px",
              height: "32px"
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
                  Header: "Delete",
                  Cell: (row) => (
                    <span style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline' }}
                      onClick={() => {
                        let data = this.state.data;
                        APIUtils.deleteStock(this.state.data[row.index].code)
                        data.splice(row.index, 1)
                        this.setState({ data })
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
                    <span style={{ color: "#0f0" }}>{
                      data.reduce((total, { perChange }) => total += perChange, 0)
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