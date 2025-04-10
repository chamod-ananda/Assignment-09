const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
      const TILE_SIZE = 40;
      const PLAYER_SIZE = 30;

      let player = { x: 1, y: 1 };
      let score = 0;
      let currentLevel = 0;
      let exitActive = false;

      // Original levels data
      const originalLevels = [
        {
          // Level 1
          map: [
            "WWWWWWWWWWWWW",
            "WP C   W    W",
            "W WWWW W WW W",
            "W W      C  W",
            "W W WWWWWWW W",
            "W C   W     W",
            "WWWWW   WWW W",
            "W   C W W C W",
            "W WWW W W W W",
            "W     C   E W",
            "WWWWWWWWWWWWW",
          ],
          coins: 5,
        },
        {
          // Level 2
          map: [
            "WWWWWWWWWWWWW",
            "W C W     C W",
            "W W WWW WWW W",
            "W C   C   C W",
            "W WWWWWWWWW W",
            "WP C W   C  W",
            "W W W WWW WWW",
            "W C C W   E W",
            "W WWWWW WWW W",
            "W   C   C   W",
            "WWWWWWWWWWWWW",
          ],
          coins: 7,
        },
        {
          // Level 3
          map: [
            "WWWWWWWWWWWWW",
            "W C WWW  W C W",
            "W W C WWWWW W",
            "W C W     C W",
            "W WWW WWWWW W",
            "W C   C   C W",
            "W WWWWW W W W",
            "W C W C W C W",
            "WPW W W W W W",
            "W   C   C E W",
            "WWWWWWWWWWWWW",
          ],
          coins: 8,
        },
        {
          // Level 4 (Final)
          map: [
            "WWWWWWWWWWWWW",
            "W P W C W C W",
            "W WWW W W W W",
            "W C W C C C W",
            "W W W WWWWW W",
            "W C C W   C W",
            "W WWWWW W W W",
            "W C W C W C W",
            "W W W W W W W",
            "W C C C C E W",
            "WWWWWWWWWWWWW",
          ],
          coins: 10,
        },
      ];

      let levels = JSON.parse(JSON.stringify(originalLevels));

      // Game elements
      const victoryButtons = document.querySelector(".victory-buttons");
      const playAgainBtn = document.getElementById("playAgainBtn");
      const quitBtn = document.getElementById("quitBtn");

      function showVictoryButtons() {
        victoryButtons.style.display = "flex";
      }

      function hideVictoryButtons() {
        victoryButtons.style.display = "none";
      }

      function resetGame() {
        score = 0;
        currentLevel = 0;
        exitActive = false;
        document.getElementById("score").textContent = "0";
        levels = JSON.parse(JSON.stringify(originalLevels));
        loadLevel(0);
        drawGame();
        hideVictoryButtons();
      }

      function loadLevel(levelIndex) {
        currentLevel = levelIndex;
        document.getElementById("level").textContent = levelIndex + 1;
        exitActive = false;

        // Find player start position
        levels[levelIndex].map.forEach((row, y) => {
          const x = row.indexOf("P");
          if (x !== -1) player = { x, y };
        });
      }

      function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw maze
        levels[currentLevel].map.forEach((row, y) => {
          row.split("").forEach((cell, x) => {
            if (cell === "W") {
              ctx.fillStyle = "#7f8c8d";
              ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (cell === "C") {
              ctx.fillStyle = "#f1c40f";
              ctx.beginPath();
              ctx.arc(
                x * TILE_SIZE + TILE_SIZE / 2,
                y * TILE_SIZE + TILE_SIZE / 2,
                TILE_SIZE / 4,
                0,
                Math.PI * 2
              );
              ctx.fill();
            } else if (cell === "E" && exitActive) {
              ctx.fillStyle = "#2ecc71";
              ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
          });
        });

        // Draw player
        ctx.fillStyle = "#3498db";
        ctx.fillRect(
          player.x * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2,
          player.y * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2,
          PLAYER_SIZE,
          PLAYER_SIZE
        );
      }

      function movePlayer(dx, dy) {
        const newX = player.x + dx;
        const newY = player.y + dy;

        // Boundary checking
        if (
          newX < 0 ||
          newX >= levels[currentLevel].map[0].length ||
          newY < 0 ||
          newY >= levels[currentLevel].map.length
        )
          return;

        const cell = levels[currentLevel].map[newY][newX];

        if (cell !== "W") {
          player.x = newX;
          player.y = newY;

          if (cell === "C") {
            score += 10;
            document.getElementById("score").textContent = score;
            levels[currentLevel].map[newY] =
              levels[currentLevel].map[newY].substring(0, newX) +
              " " +
              levels[currentLevel].map[newY].substring(newX + 1);

            if (--levels[currentLevel].coins === 0) {
              exitActive = true;
            }
          }

          if (exitActive && cell === "E") {
            if (currentLevel < levels.length - 1) {
              loadLevel(currentLevel + 1);
            } else {
              showVictoryButtons();
            }
          }
        }
      }

      // Event listeners
      document.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowUp":
            movePlayer(0, -1);
            break;
          case "ArrowDown":
            movePlayer(0, 1);
            break;
          case "ArrowLeft":
            movePlayer(-1, 0);
            break;
          case "ArrowRight":
            movePlayer(1, 0);
            break;
        }
        drawGame();
      });

      playAgainBtn.addEventListener("click", resetGame);
      quitBtn.addEventListener("click", () => {
        resetGame();
        alert("Thanks for playing!");
      });

      // Initialize game
      resetGame();