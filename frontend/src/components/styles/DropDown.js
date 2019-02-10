import styled, { keyframes } from 'styled-components'

const DropDown = styled.div`
  position: relative;
  width: 70%;
  z-index: 2;
  border: 1px solid black;
`

const DropDownItem = styled.div`
  border-bottom: 1px solid black;
  background: ${props => (props.highlighted ? '#fffcdf' : 'white')};
  padding: 1rem;
  transition: all 0.2s;
  ${props => (props.highlighted ? 'padding-left: 2rem;' : null)};
  display: grid;
  grid-template-columns: (1fr);
  border-left: 10px solid ${props => (props.highlighted ? '#fffcdf' : 'white')};
`

const glow = keyframes`
  from {
    box-shadow: 0 0 0px #fffcdf;
  }

  to {
    box-shadow: 0 0 10px 1px #fffcdf;
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
    border-bottom: 1px solid black;
    font-size: 1rem;
    display: flex;
    align-items: left;
    &.loading {
      animation: ${glow} 0.5s ease-in-out infinite alternate;
    }
  }
`

export { DropDown, DropDownItem, SearchStyles }
