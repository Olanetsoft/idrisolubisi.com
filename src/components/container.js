import React from 'react';
import styled from 'styled-components';

function Container({ children }) {
  return <StyledContainer>{children}</StyledContainer>;
}

export default Container;

const StyledContainer = styled.div`
  width: 670px;
  max-width: 100%;
  margin: 0 auto;
`;
