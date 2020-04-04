import React from "react";
import { randomWord } from "./Word";
import styled, { createGlobalStyle } from "styled-components";

import step0 from "./images/0.jpg";
import step1 from "./images/1.jpg";
import step2 from "./images/2.jpg";
import step3 from "./images/3.jpg";
import step4 from "./images/4.jpg";
import step5 from "./images/5.jpg";
import step6 from "./images/6.jpg";

let gameStart;

const GlobalStyle = createGlobalStyle`
  body{
    padding:0;
    margin:0; 
    width:100%;
    display:flex;
    justify-content:center;
  }
`;

class Hangman extends React.Component {
  static defaultProps = {
    maxWrong: 6,
    images: [step0, step1, step2, step3, step4, step5, step6],
  };

  constructor(props) {
    super(props);
    this.state = {
      mistake: 0,
      guessed: new Set(),
      answer: randomWord(),
    };
    this.handleGuess = this.handleGuess.bind(this);
    this.keyPress = this.keyPress.bind(this);
    window.addEventListener("keydown", this.keyPress);
  }

  guessWord() {
    return this.state.answer
      .split("")
      .map((bingo) => (this.state.guessed.has(bingo) ? bingo : "_"));
  }

  handleGuess(value) {
    let letter = value;
    this.setState((st) => ({
      guessed: st.guessed.add(letter),
      mistake: st.mistake + (st.answer.includes(letter) ? 0 : 1),
    }));
  }

  keyPress(event) {
    if (gameStart === "YOU WON" || gameStart === "YOU LOST") {
      if (event.keyCode === 8 || event.keyCode === 13 || event.keyCode === 32) {
        this.resetButton();
      }
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      this.handleGuess(event.key);
    } else if (
      event.keyCode === 8 ||
      event.keyCode === 13 ||
      event.keyCode === 32
    ) {
      this.resetButton();
    } else {
    }
  }

  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
      <Buttons
        key={letter}
        value={letter}
        onClick={(e) => this.handleGuess(e.target.value)}
        disabled={this.state.guessed.has(letter)}
      >
        {letter}
      </Buttons>
    ));
  }

  resetButton = () => {
    this.setState({
      mistake: 0,
      guessed: new Set(),
      answer: randomWord(),
    });
  };

  render() {
    const gameOver = this.state.mistake >= this.props.maxWrong;
    const altText = `${this.state.mistake}/${this.props.maxWrong} wrong guesses`;
    const isWinner = this.guessWord().join("") === this.state.answer;
    gameStart = this.generateButtons();

    if (isWinner) {
      gameStart = "U WON";
    }
    if (gameOver) {
      gameStart = "U LOST";
    }

    return (
      <>
        <GlobalStyle />
        <nav>
          <Header>
            <a href="/">
              Hangman. <small>Do (or) Die</small>
            </a>
            <span> Guess Wrong: {this.state.mistake}</span>
          </Header>
          <div className="collapse navbar-collapse" id="navbarText">
            <span className="navbar-text text-primary">
              Guessed wrong: {this.state.mistake}
            </span>
          </div>
        </nav>
        <ImgDiv>
          <Img src={this.props.images[this.state.mistake]} alt={altText} />
        </ImgDiv>
        <AnswerBox>
          <p> Guess the Word?</p>
          {!gameOver ? this.guessWord() : this.state.answer}
        </AnswerBox>
        <Keybord>
          <ButtonContainer>{gameStart}</ButtonContainer>
          <ResetButton onClick={this.resetButton}>Reset</ResetButton>
        </Keybord>
      </>
    );
  }
}

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const ImgDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-left: 50px;
  margin-bottom: 40px;
`;

const Img = styled.img``;

const Keybord = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: max-content;
  grid-template-rows: 1fr 100px;
  justify-items: center;
  padding: 0 20%;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 100px);
  justify-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ResetButton = styled.button`
  background-color: #05ffc9;
  font-size: 14px;
  display: flex;
  justify-content: center;
  width: 250px;
`;

const Buttons = styled.button`
  background-color: #05ffc9;
  width: 3em;
  font-size: 14px;
  padding: 5px;
  margin: 3px;
  border-radius: 5px;
  :hover {
    cursor: pointer;
  }
`;

const AnswerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

export default Hangman;
