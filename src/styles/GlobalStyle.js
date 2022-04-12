import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    box-sizing: border-box;
    margin: 0;
    color: #424B5A;
    font-family: 'Noto Sans TC', sans-serif;
    ${"" /* font-family: 'Noto Serif TC', serif; */}
  }
  a {
    text-decoration: none;
  }
  button {
    cursor: pointer;
    font-size: 16px;
    border: none;
    background: #424b5a;
    width: 120px;
    height: 40px;
    color: #fff;
    border-radius: 5px;

    &:hover {
      background: #c1b18a;
    }
  }
`;
