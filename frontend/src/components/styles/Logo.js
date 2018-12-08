import styled from 'styled-components'

const Logo = styled.h1`
  font-size: 2rem;
  margin-left: 0rem;
  position: relative;
  z-index: 2;
  transform: skew(-7deg);
  a {
    padding: 0.5rem 1rem;
    background: #f9c321;
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`

export default Logo
