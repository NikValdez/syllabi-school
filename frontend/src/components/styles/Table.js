import styled from 'styled-components'

export const TableStyles = styled.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
`
export const TdSyles = styled.td`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  font-size: 20px;
`
export const ThSyles = styled.th`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
`
export const TrSyles = styled.tr`
  &:nth-child(even) {
    background: #f9c32117;
  }
  &:hover {
    background: #f9c32161;
  }
`
