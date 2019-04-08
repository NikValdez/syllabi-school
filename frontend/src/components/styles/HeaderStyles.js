import styled from 'styled-components'

const StyledHeader = styled.header`
  width: 100%;
  white-space: wrap;
  .bar {
    background: black;
    padding: 0 30px;
    height: 40px;
    width: 101vw;
  }
  .bar-2 {
    background: #fffcdf;
    padding: 0 30px;
    height: 70px;
    width: 101vw;
    p {
      padding: 20px 30px;
    }
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
    padding-top: 10px;
  }
`

export default StyledHeader
