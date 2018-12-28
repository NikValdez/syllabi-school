import styled from 'styled-components'

const Button = styled.button`
  background: #f9c321;
  color: white;
  font-weight: 500;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  transform: skew(-2deg);
  display: inline-block;
  transition: all 0.5s;
  &[disabled] {
    opacity: 0.5;
  }
`

export default Button
