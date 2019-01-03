import styled, { keyframes } from 'styled-components'

const DropDown = styled.div`
  position: relative;
  width: 50%;
  z-index: 2;
  border: 1px solid #f9c321;
`

const DropDownItem = styled.div`
  border-bottom: 1px solid #f9c321;
  background: ${props => (props.highlighted ? '#f7f7f7' : 'white')};
  padding: 1rem;
  transition: all 0.2s;
  ${props => (props.highlighted ? 'padding-left: 2rem;' : null)};
  display: flex;
  align-items: left;
  border-left: 10px solid ${props => (props.highlighted ? 'grey' : 'white')};
`

const glow = keyframes`
  from {
    box-shadow: 0 0 0px yellow;
  }

  to {
    box-shadow: 0 0 10px 1px yellow;
  }
`

const SearchStyles = styled.div`
  position: relative;
  input {
    width: 50%;
    padding: 5px;
    border: 0;
    font-size: 1rem;
    display: flex;
    align-items: left;
    &.loading {
      animation: ${glow} 0.5s ease-in-out infinite alternate;
    }
  }
`

export { DropDown, DropDownItem, SearchStyles }
