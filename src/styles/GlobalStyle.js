import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
    position: relative;
    color: #424B5A;
    ${"" /* background: #fafafa; */}
    font-family: 'Noto Sans TC', sans-serif;
    ${"" /* font-family: 'Noto Serif TC', serif; */}
  }
  a {
    text-decoration: none;
  }
  
`;
