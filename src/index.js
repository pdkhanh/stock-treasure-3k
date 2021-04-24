import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { StyledTable } from "./style/StyledTable"

import "react-table/react-table.css";
import { APIUtils } from "./APIUtils";
import Loader from "react-loader-spinner";

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
    this.setState({ isLoading: "none" });
  }

  handleInputChange = (cellInfo, event) => {
    let data = [...this.state.data];
    data[cellInfo.index][cellInfo.column.id] = +event.target.value;
    var currentPrice = data[cellInfo.index]['currentPrice']
    var change = currentPrice - +event.target.value
    var perChange = ((change / +event.target.value) * 100).toFixed(2);

    data[cellInfo.index]['change'] = change
    data[cellInfo.index]['perChange'] = parseFloat(perChange)

    this.setState({ data });
  };

  handleNoteChange = (cellInfo, event) => {
    let data = [...this.state.data];
    data[cellInfo.index][cellInfo.column.id] = event.target.value;

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
          backgroundColor: "black",
          width: "100%"
        }}
        onChange={this.handleInputChange.bind(null, cellInfo)}
        value={parseInt(cellValue)}
        onKeyPress={this.handleEditInitPriceKeyPress}
      />
    );
  };

  renderEditableNote = (cellInfo) => {
    const cellValue = this.state.data[cellInfo.index][cellInfo.column.id];
    return (
      <input
        placeholder="Note here"
        name="input"
        type="text"
        autoComplete="off"
        style={{
          color: "white",
          backgroundColor: "black",
          width: "100%"
        }}
        onChange={this.handleNoteChange.bind(null, cellInfo)}
        value={cellValue}
        onKeyPress={this.handleEditInitPriceKeyPress}
      />
    );
  };

  handleEditInitPriceKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.updateStock();
    }
  }

  handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const result = await this.addStock();
      if (result) {
        document.getElementById("stockCode").value = ""
        document.getElementById("inputInitPrice").value = ""
      }
    }
  }

  updateStock = async () => {
    this.setState({ isLoading: "block" })
    var response = await APIUtils.updateStock(this.state.data);
    this.setState({ data: response });
    this.setState({ isLoading: "none" })
  };

  addStock = async () => {
    this.setState({ isLoading: "block" })
    var stockData = {
      code: document.getElementById("stockCode").value,
      initPrice: document.getElementById("inputInitPrice").value === "" ? 0 : document.getElementById("inputInitPrice").value,
      addedDate: new Date().toLocaleDateString()
    }

    var response = await APIUtils.addStock(stockData)
    if (response.message !== undefined) {
      alert(response.message);
      this.setState({ isLoading: "none" })
      return false
    }
    this.state.data.push(response)
    this.setState({ data: this.state.data });
    this.setState({ isLoading: "none" })
    return true
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
            onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
            onKeyPress={this.handleKeyPress}
          />
          <input
            style={{
              backgroundColor: "black",
              color: "#0f0",
              width: "150px",
              height: "27px"
            }}
            onKeyPress={this.handleKeyPress}
            placeholder="Init Price" id="inputInitPrice" type="text"
          />
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
          <div style={{
            position: "relative",
          }}>
            <StyledTable
              style={{
                backgroundColor: "black",
                color: "white",
                position: "absolute",
                width: "100%",
              }}
              data={data}
              columns={[
                {
                  Header: "",
                  width: 70,
                  Cell: (row) => (
                    <span style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline', 'text-align': 'center' }}
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
                  width: 70,
                  accessor: "code",
                  style: { 'text-align': 'center' }
                },
                {
                  width: 100,
                  Header: "Added Date",
                  accessor: "addedDate",
                  style: { 'text-align': 'center' }
                },
                {
                  Header: "Note",
                  accessor: "note",
                  Cell: this.renderEditableNote
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
                            rowInfo.row.currentPerChange >= 6.9 ? "#ff25ff" : rowInfo.row.currentPerChange > 0 ? "#0f0" : rowInfo.row.currentPerChange === 0 ? "#ffd900" : "#ff3737",
                          'text-align': 'center'
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
                            rowInfo.row.currentPerChange >= 6.9 ? "#ff25ff" : rowInfo.row.currentPerChange > 0 ? "#0f0" : rowInfo.row.currentPerChange === 0 ? "#ffd900" : "#ff3737",
                          'text-align': 'center'
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
                            rowInfo.row.currentPerChange >= 6.9 ? "#ff25ff" : rowInfo.row.currentPerChange > 0 ? "#0f0" : rowInfo.row.currentPerChange === 0 ? "#ffd900" : "#ff3737",
                          'text-align': 'center'
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
                          color:
                            rowInfo.row.perChange >= 30 ? "#ff25ff" : rowInfo.row.perChange > 0 ? "#0f0" : rowInfo.row.perChange === 0 ? "#ffd900" : "#ff3737",
                          'text-align': 'center'
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
                          color:
                            rowInfo.row.perChange >= 30 ? "#ff25ff" : rowInfo.row.perChange > 0 ? "#0f0" : rowInfo.row.perChange === 0 ? "#ffd900" : "#ff3737",
                          'text-align': 'center'
                        }
                      };
                    }
                    return {};
                  },
                  Footer: (
                    <span style={{ color: "#0f0" }}>{
                      (data.reduce((total, { perChange }) => total += perChange, 0)).toFixed(2)
                    }%</span>
                  )
                }
              ]}
              className="-striped -highlight"
            />
            <Loader style={{
              position: "fixed",
              display: isLoading,
              "top": "40%",
              "left": "50%",
              "margin-top": "-100px",
              "margin-left": "-100px",
            }}
              type="BallTriangle"
              color="#0f0"
            />
          </div>
        }
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);