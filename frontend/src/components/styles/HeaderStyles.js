import styled from 'styled-components'

const StyledHeader = styled.header`
  width: 100%;
  white-space: wrap;
  .bar {
    background: black;
    padding: 0 30px;
    height: 35px;
    width: 100vw;
  }
  .bar-2 {
    background: #73c8a9; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #373b44,
      #73c8a9
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #373b44,
      #73c8a9
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    padding: 0 30px;
    height: 70px;
    width: 101vw;
    p {
      /* padding: 20px 30px; */
      margin-top: 10px;
      margin-bottom: 0px;
      color: white;
    }
  }
  h3 {
    color: white;
    margin-top: 10px;
  }
  .logo {
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 18px;
    &:hover {
      color: #fffcdf;
    }
  }
  .d-flex justify-content-between {
    height: 40px;
  }
  .nav-item {
    /* padding-top: 10px; */
    margin-top: 5px;
  }
`

export default StyledHeader
