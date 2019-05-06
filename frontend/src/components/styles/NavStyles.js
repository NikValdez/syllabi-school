import styled from 'styled-components'

const NavStyles = styled.ul`
  .dropdown-toggle::after {
    display: none;
  }
  .dropdown-toggle {
    &:hover {
      background: #fffcdf;
    }
  }
  .dropdown-toggle {
    &:hover {
      svg {
        fill: black;
      }
    }
  }
  .show > .btn-primary.dropdown-toggle {
    svg {
      fill: black;
    }
  }

  svg {
    fill: white;
  }
  svg:hover {
    fill: black;
  }

  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  .btn {
    background: none;
    border: none;
    outline: none;
  }
  .btn:focus,
  .btn:active {
    outline: none !important;
    box-shadow: none !important;
  }
  .btn:active {
    background-color: transparent !important;
  }

  .announcement-button {
    padding-top: 10px;
  }
  #dropdown-basic {
    /* padding-top: 10px; */
    margin-right: 7rem;
    border-radius: 0;
    padding-bottom: 10px;
  }

  #dropdown-annonucements {
    position: relative;
    background: none;
  }
  .dropdown-menu.show {
    height: 90vh;
    background: black;
  }
  #dropdown-announcement-items {
    /* width: 15rem; */
    width: 30vw;
    top: -20px !important;
    margin-right: 16rem;
  }
  #dropdown-items {
    width: 30vw;
    margin-right: 12rem;
    top: -7px !important;
  }
  #dropdown-items a {
    color: white;

    margin-bottom: 1rem;

    margin-left: 1rem;
    &:hover {
      color: #fffcdf;
    }
  }
  #dropdown-items button {
    color: white;
    text-align: left;
    padding-left: 1rem;
    &:hover {
      color: #fffcdf;
    }
  }

  a,
  button {
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;

    background: none;
    border: 0;
    text-decoration: none;
    cursor: pointer;
    color: black;
    font-weight: 800;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
  }
  .signin {
    color: white;
  }
  .show > .btn-primary.dropdown-toggle {
    background: #fffcdf;
    outline: none;
  }

  th {
    text-align: center;
  }
  td {
    p:hover {
      color: #fffcdf;
    }
  }
`

export default NavStyles
