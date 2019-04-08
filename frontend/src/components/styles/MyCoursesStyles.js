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
  }
  a::after {
    content: '';
    display: block;
    width: 0;
    height: 1px;
    background: #000;
    transition: width 0.3s;
  }
  a:hover::after {
    width: 100%;
    transition: width 0.3s;
  }
  .fa-plus,
  .fa-minus {
    float: right;
    @media (min-width: 768px) {
      margin-right: 5rem;
    }
    @media (min-width: 992px) {
      margin-right: 15rem;
    }
    @media (min-width: 435px) {
      margin-right: 3rem;
    }
    @media (min-width: 1200px) {
      margin-right: 15rem;
    }
  }
`

export default MyCoursesStyles
