import styled from 'styled-components'

const Container = styled.div`
  padding-right: 5px;
  padding-left: 5px;
  margin-right: 10px;
  margin-left: 20px;

  @media (min-width: 768px) {
    width: 750px;
  }

  @media (min-width: 992px) {
    width: 970px;
  }

  @media (min-width: 1200px) {
    width: 1270px;
  }
`

export default Container
