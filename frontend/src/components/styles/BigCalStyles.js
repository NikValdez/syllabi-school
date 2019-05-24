import styled from 'styled-components'
import Empty from './empty.png'
import './fonts/NeuzeitOffice-Regular.svg'
import left from './left.svg'
import right from './right.svg'

const BigCalStyles = styled.div`
  margin-right: 20px;
  height: 85vh;
  width: 65vw;
  margin: 2rem auto;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  .rbc-calendar {
    .rbc-month-header {
      border-color: #f5f5f5;
      background: #f5f5f5;
      padding: 5px;
      border-bottom: 1px solid #ddd;
      font-family: 'Neuzeit Office';
    }
    .rbc-off-range-bg {
      background: #e5e5e526;
    }
    .rbc-header {
      border: none;
      font-family: 'Neuzeit Office';
      font-weight: 200;
    }
    .rbc-date-cell {
      font-size: 12px;
      text-align: left;
      padding: 2px 5px;
    }
  }
  .rbc-show-more {
    color: #f9c321ab;
  }
  .rbc-event {
    color: black;
    border-radius: 0;
    font-size: 12px;
    padding: 5px;
  }
  .rbc-today {
    background: url(${Empty});
  }
  .rbc-toolbar-label {
    font-size: 17px;
    margin-left: -85px;
  }
  .rbc-toolbar {
    background: transparent;
  }
  .rbc-btn-group {
    button:nth-child(3) {
      //next
      color: white;
      border: none;
      position: absolute;
      right: 10px;
      &:before {
        content: url(${right});
        width: 50%;
      }
    }
    button:nth-child(2) {
      //back
      color: transparent;
      border: none;
      position: relative;
      float: left;
      &:before {
        content: url(${left});
        width: 50%;
      }
    }
    button:first-child:not(:last-child) {
      display: none;
    }
    button:hover {
      background: transparent;
      color: white;
      border: none;
    }
    button:active {
      background: transparent;
      color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
    }
    button:focus {
      background: transparent;
      color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
    }
  }
`
export default BigCalStyles
