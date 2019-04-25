import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export const FaceCard = styled.div`
  text-align: center;
  color: #fff;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  z-index: 1;
`;

export const NameSection = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  background: #353131;
  padding: 0 10px;
  text-transform: capitalize;
  margin-bottom: 10px;
  a {
    margin-left: 10px;
    &:hover svg {
      stroke: #16cabd;
    }
  }
`;

export const StyledHeader = styled.header`
  background: rgb(251, 254, 207);
  background: transparent;
  width: 100%;
  height: 50px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;
export const Nav = styled.nav`
  display: flex;
`;

export const StyledPaper = styled(Paper)`
  && {
    background: transparent;
    margin: 0 2rem;
    /* padding: 1rem 3rem 3rem 3rem; */
    height: ${props => (props.height ? props.height : "auto")};
  }
`;

export const Avatar = styled.img`
  border-radius: 50%;
  width: 128px;
  height: 128px;
`;

export const SearchBar = styled.form`
  display: flex;
  align-items: center;
  margin-right: 4rem;
`;

export const ScrollContainer = styled(Grid)`
  height: 90vh;
  overflow-y: scroll;
`;

export const MobileNav = styled(Paper)`
  position: absolute;
  left: 27px;
  top: 52px;
  z-index: 10;
`;
