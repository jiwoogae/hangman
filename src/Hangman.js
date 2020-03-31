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

createGlobalStyle`
body{
  padding:0;
  margin:0; 
}
`;

class Hangman extends React.Component {
  static defaultProps = {
    maxWrong: 6,
    images: [step0, step1, step2, step3, step4, step5, step6]
  };

  constructor(props) {
    super(props);
    this.state = {
      mistake: 0,
      guessed: new Set(),
      answer: randomWord()
    };
    this.handleGuess = this.handleGuess.bind(this);
    this.keyPress = this.keyPress.bind(this);
    window.addEventListener("keydown", this.keyPress);
  }

  guessWord() {
    return this.state.answer
      .split("")
      .map(bingo => (this.state.guessed.has(bingo) ? bingo : "_"));
  }

  handleGuess(value) {
    let letter = value;
    this.setState(st => ({
      guessed: st.guessed.add(letter),
      mistake: st.mistake + (st.answer.includes(letter) ? 0 : 1)
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
    return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
      <Buttons
        key={letter}
        value={letter}
        onClick={e => this.handleGuess(e.target.value)}
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
      answer: randomWord()
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
        <nav>
          <a href="/">
            Hangman. <small>Do (or) Die</small>
          </a>
          <span> Guess Wrong: {this.state.mistake}</span>
          <button
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item "></li>
              <li className="nav-item"></li>
              <li className="nav-item"></li>
            </ul>
            <span className="navbar-text text-primary">
              Guessed wrong: {this.state.mistake}
            </span>
          </div>
        </nav>

        <Img src={this.props.images[this.state.mistake]} alt={altText} />

        <p> Guess the Word?</p>
        <p>
          {!gameOver ? this.guessWord() : this.state.answer}
          {""}
        </p>
        <KeyBord>
          <ButtonContainer>{gameStart}</ButtonContainer>
          <ResetButton onClick={this.resetButton}>Reset</ResetButton>
        </KeyBord>
      </>
    );
  }
}

const KeyBord = styled.div`
  display: block;
  margin: 0 auto;
`;

const Img = styled.img`
  display: block;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  width: 30%;
  margin-bottom: 10px;
`;

const ResetButton = styled.button`
  background-color: #05ffc9;
  width: 5em;
  font-size: 14px;
  padding: 5px;
  margin: 3px;
  border-radius: 5px;
  :hover {
    cursor: pointer;
  }
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

export default Hangman;
