import styled from 'styled-components'

const UploadButton = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;

  button {
    background: black;
    color: white;
    font-weight: 500;
    border: 0;
    border-radius: 0;
    text-transform: uppercase;
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    display: inline-block;
    margin-top: 2rem;
  }

  input[type='file'] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
`

export default UploadButton
