import styled, { keyframes } from 'styled-components'

const DropDown = styled.div`
  position: relative;
  width: 70%;
  z-index: 2;
  border: 1px solid #f9c321;
  a {
    color: black;
    font-family: arial, sans-serif;
  }
`

const DropDownItem = styled.div`
  border-bottom: 1px solid #f9c321;
  background: ${props => (props.highlighted ? '#f9c3217d' : 'white')};
  padding: 1rem;
  transition: all 0.2s;
  ${props => (props.highlighted ? 'padding-left: 2rem;' : null)};
  display: grid;
  grid-template-columns: (1fr);
  border-left: 10px solid ${props => (props.highlighted ? '#f9c321' : 'white')};
`

const glow = keyframes`
  from {
    box-shadow: 0 0 0px #f9c321;
  }

  to {
    box-shadow: 0 0 10px 1px #f9c321;
  }
`

const SearchStyles = styled.div`
  position: relative;
  input {
    margin-top: 3rem;
    outline: none;
    width: 70%;
    padding: 5px;
    border: 0;
    border-bottom: 2px solid #f9c321;
    font-size: 1rem;
    display: flex;
    align-items: left;
    &.loading {
      animation: ${glow} 0.5s ease-in-out infinite alternate;
    }
  }
`

export { DropDown, DropDownItem, SearchStyles }
