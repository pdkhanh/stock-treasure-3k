import styled from "styled-components";
import ReactTable from "react-table";

export default styled(ReactTable)`
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

.-pageInfo {
  color: rgb(0, 255, 0);
}


.-pagination .-pageJump input {
    color: rgb(0, 255, 0);
    background: black;
}

.-pagination .-pageSizeOptions select {
    color: rgb(0, 255, 0);
    background: black;
}

.rt-noData {
  visibility: none;
}

.rt-noData:after {
  content: "links";
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