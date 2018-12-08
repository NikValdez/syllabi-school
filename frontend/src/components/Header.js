import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Logo from './styles/Logo'
import Nav from '../components/Nav'

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid black;
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid grey;
  }
`

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link to="/">Schedule</Link>
      </Logo>
      <Nav />
    </div>
  </StyledHeader>
)

export default Header
