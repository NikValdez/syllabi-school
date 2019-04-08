import styled from 'styled-components'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  /* margin: 2rem auto; */

  display: grid;
  .modal-content {
    width: 180% !important;
  }

  a {
    color: black;
  }
  .update-delete {
    text-align: right;
    a {
      margin-right: 2rem;
      background: black;
      color: white;
      font-weight: 500;
      border: 0;
      border-radius: 0;
      text-transform: uppercase;
      font-size: 1rem;
      padding: 0.5rem 1.2rem;
      display: inline-block;
      text-decoration: none;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    text-align: center;
    margin-top: -20rem;
  }
`

export default SingleCourseStyles
