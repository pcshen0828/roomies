import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
    position: relative;
    color: #424B5A;
    ${"" /* background: #E4E6EB; */}
    font-family: 'Noto Sans TC', sans-serif;
    ${"" /* font-family: 'Noto Serif TC', serif; */}
  }
  a {
    text-decoration: none;
  }
  form {
    width: 100%;
  }
`;

const mainColor = "#424b5a";
const subColor = "#c1b18a";

export { mainColor, subColor };
