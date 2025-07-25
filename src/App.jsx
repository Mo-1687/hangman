import { useState } from "react";
import { languages } from "./languageArray";
import clsx from "clsx";
import { getFarewellText } from "./utilities";
import { getRandomWord } from "./words";
import Confetti from "react-confetti";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [userGuess, setUserGuess] = useState([]);
  const [farewell, setFarewell] = useState(false);
  let wrongGuessesCount = userGuess.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  // Check if the game is over either win or lost
  const isGameWon = currentWord
    .split("")
    .every((letter) => userGuess.includes(letter));

  const isGameLost = wrongGuessesCount === languages.length - 1;

  const isGameOver = isGameWon || isGameLost;

  const messageClass = clsx("message", {
    "you-win": isGameWon,
    "you-lost": isGameLost,
  });

  const langTags = languages.map((lang, i) => (
    <span
      style={{
        color: lang.color,
        backgroundColor: lang.backgroundColor,
      }}
      className={wrongGuessesCount > i ? "lost" : ""}
      key={i}
    >
      {lang.name}
    </span>
  ));

  // Function to add the guessed letters and check if they are duplicated or not
  function handleUserChoice(letter) {
    setUserGuess((prv) => (prv.includes(letter) ? prv : [...prv, letter]));

    if (!currentWord.includes(letter)) {
      setFarewell(true);
    } else {
      setFarewell(false);
    }
  }

  function newGame() {
    setUserGuess([]);
    setFarewell(false);

    let newWord;

    do {
      newWord = getRandomWord();
    } while (currentWord === newWord);

    setCurrentWord(newWord);
  }

  const letters = currentWord
    ? [...currentWord].map((letter, i) => {
        const isGuessed = userGuess.includes(letter);
        const isCorrect = currentWord.includes(letter);
        const isMissed = isGameOver && !isGuessed && isCorrect;
        return (
          <span key={i} className={isMissed ? "missed" : ""}>
            {userGuess.includes(letter) || isGameOver
              ? letter.toUpperCase()
              : ""}
          </span>
        );
      })
    : [];

  // Class Names for alphabet buttons
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const btnElements = [...alphabet].map((letter, i) => {
    const isGuessed = userGuess.includes(letter);
    const isCorrect = currentWord.includes(letter);
    const classNames = clsx({
      correct: isGuessed && isCorrect,
      wrong: isGuessed && !isCorrect,
      disable: isGameOver || (isGuessed && !isCorrect),
    });

    return (
      <button
        className={classNames}
        key={i}
        onClick={() => handleUserChoice(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1 className="title">Assembly: Endgame</h1>
        <p className="description">
          uses the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <p
        className={farewell && "farewell"}
        role="farewell-message"
        aria-live="polite"
      >
        {farewell && getFarewellText(languages[wrongGuessesCount - 1].name)}
      </p>

      <div className={messageClass} role="status-message" aria-live="polite">
        {isGameWon && (
          <div>
            <h2>You win!</h2>
            <p>Well done! 🎉</p>
          </div>
        )}

        {isGameLost && (
          <div>
            <h2>Game over</h2>
            <p>You better start learning Assembly </p>
          </div>
        )}
      </div>

      <div className="langs">{langTags}</div>

      <div className="word">{letters}</div>

      <div className="alphabet">{btnElements}</div>

      <section className="sr-only">
        <p>{letters}</p>

        <p>
          {currentWord.includes(userGuess[userGuess.length - 1])
            ? "Correct"
            : `Wrong: you have ${
                languages.length - wrongGuessesCount
              } attempts left`}
        </p>
      </section>

      {isGameOver && (
        <button
          className="new-game-btn"
          onClick={newGame}
          title="New game button"
        >
          New Game
        </button>
      )}
    </main>
  );
}

export default App;
