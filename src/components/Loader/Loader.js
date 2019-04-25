import React from "react";
import ContentLoader from "react-content-loader";
import {
  FaceCard,
  NameSection,
  StyledPaper
} from "../StyledComponents/StyledComponents";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";

const Placeholders = () => (
  <FaceCard>
    <NameSection>
      <p />
    </NameSection>
    <ContentLoader
      height={65}
      width={100}
      speed={4}
      primaryColor="rgba(219,241,191,.8)"
      secondaryColor="#fff"
    >
      <circle cx="50" cy="20" r="18" />
      <rect x="10" y="45" rx="4" ry="4" width="80" height="3" />
      <rect x="10" y="55" rx="3" ry="3" width="80" height="3" />
    </ContentLoader>
  </FaceCard>
);

const Loader = ({ amount, bottom }) => {
  const items = new Array(amount).fill(<Placeholders />);

  return bottom ? (
    items.map((item, index) => (
      <Fade in key={index} timeout={{ enter: 100, exit: 700 }}>
        <Grid item xs={12} sm={6} md={4}>
          {item}
        </Grid>
      </Fade>
    ))
  ) : (
    <StyledPaper elevation={0} style={{ marginTop: "76px" }}>
      <Grid
        container
        spacing={24}
        style={{ height: "80vh", overflowY: "scroll" }}
      >
        {items.map((item, index) => (
          <Fade in key={index} timeout={{ enter: 100, exit: 700 }}>
            <Grid item xs={12} sm={6} md={4}>
              {item}
            </Grid>
          </Fade>
        ))}
      </Grid>
    </StyledPaper>
  );
};

export default Loader;
