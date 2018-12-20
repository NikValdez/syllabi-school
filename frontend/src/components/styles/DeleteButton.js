import styled from 'styled-components'

const DeleteButton = styled.button`
  width: auto;
  border: 0;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  display: inline-block;
  font-weight: bold;
  padding: 1rem 0.2rem;
  text-decoration: none;
  color: #e81c0dad;
  transition: 0.4s;
  background: white;

  &:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 4px;
    top: 100%;
    left: 0;
    border-radius: 3px;
    background: #e62e20de;
    transition: 0.2s;
  }

  &:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 4px;
    top: 0;
    left: 0;
    border-radius: 3px;
    background: #e62e20de;
    transition: 0.2s;
  }

  &:hover:before {
    top: -webkit-calc(100% - 3px);
    top: calc(100% - 3px);
  }

  &:hover:after {
    top: 3px;
  }
`

export default DeleteButton
