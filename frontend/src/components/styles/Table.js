import styled from 'styled-components'

export const TableStyles = styled.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
`
export const TdStyles = styled.td`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 2px;
  font-size: 14px;
  label {
    display: block;
    padding: 10px 5px;
  }
`
export const ThStyles = styled.th`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 2px;
`
export const TrStyles = styled.tr`
  &:nth-child(even) {
    background: #f9c32117;
  }
  &:hover {
    background: #f9c32161;
  }
`
