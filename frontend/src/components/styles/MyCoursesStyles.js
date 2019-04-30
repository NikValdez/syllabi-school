import styled from 'styled-components'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    display: inline-block;
    text-decoration: none;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    font-size: 13px;
    &:hover {
      color: #00000080;
    }
  }

  a {
    @media (min-width: 435px) {
      margin-left: 5rem;
    }
    @media (min-width: 768px) {
      margin-left: 5rem;
    }
    @media (min-width: 992px) {
      margin-left: 2rem;
    }
    @media (min-width: 1200px) {
      margin-left: 0rem;
    }
  }
`

export default MyCoursesStyles
