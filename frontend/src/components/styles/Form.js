import styled, { keyframes } from 'styled-components'

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`

const Form = styled.form`

  border: 5px solid white;
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  width: 70%;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid black;
    &:focus {
      outline: 0;
      border-color: #f9c321;
    }
  }
  textarea {
    height: 5rem;
  }
  button,
  input[type='submit'] {
    background: black;
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
    &:hover {
      background: #fffcdf;
      color: black;
    }
  }
  fieldset {
    width: 70%;
  }
`

export default Form
