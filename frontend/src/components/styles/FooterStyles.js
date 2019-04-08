import styled from 'styled-components'

const StyledFooter = styled.footer`
  background: black;
  color: white;
  /* position: fixed; */
  bottom: 0px;
  width: 101vw;

  a {
    color: white;
    margin-right: 20px;
    margin-left: 20px;
    padding-top: 10px;
    &:hover {
      color: #fffcdf;
      text-decoration: none;
    }
  }
  p {
    padding-right: 20px;
    padding-top: 10px;
  }
  .row {
    margin: 0;
  }
  .hidden-sm-down {
    padding-top: 10px;
  }
`

export default StyledFooter
