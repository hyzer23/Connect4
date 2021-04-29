// Wait until DOM has loaded
$(document).ready(function() {
    // global variables that count number of wins and won't get reset after each game
    let winsRed = 0;
    let winsYellow = 0;

    function playGame() {
        // clears the board at the beginning of each game
        $(".cell").each(function(){
            $(this).attr('style', '');
        });
        
        let player = 1;
        let winner = 0;
        let colors = {};
        colors[-1] = "Yellow";
        colors[1] = "Red";
        let count = 0;

        // iterate through each element that has the "cell" class
        $(".cell").each(function(){
            $(this).attr("id", count); // assigns id of each cell starting at 0, ends at 35
            $(this).attr("data-player", 0);
            count++;

            $(this).click(function(){
                if(isValid($(this).attr("id"))){
                    $(this).css("background-color", colors[player]); // assigns cell color to the color of the player that clicked it
                    $(this).attr("data-player", player); 
                    let audio = new Audio('piece-drop.mp3');
                    audio.play();
                    if(checkWin(player)){
                        alert(colors[player] + " has won!");
                        winner = player;

                        // assign score to winning player
                        if(winner == 1){
                            winsRed += 1;
                            $(".score1").text(winsRed);
                        }
                        else if(winner == -1){
                            winsYellow +=1;
                            $(".score2").text(winsYellow);
                        }
                        playGame();
                    }
                    player *= -1; // change to next player
                }
            });
        });

        function isValid(n){
            let id = parseInt(n);

            if(winner !== 0){ // invalidates all moves after a winner is declared
                return false;
            }

            if($("#" + id).attr("data-player") === "0"){
                if(id >= 35){
                    return true;
                }
                // check row below
                if($("#" + (id + 7)).attr("data-player") !== "0"){ 
                    return true;
                }
            }
            return false;
        }

        function checkWin(p){
            // check row win condition
            let chain = 0; // consequtive line of same color
            for(let i = 0; i < 42; i += 7){  // iterate each row
                for(let j = 0; j < 7; j++){  // iterate each cell in each row
                    let cell = $("#" + (i + j));
                    if(cell.attr("data-player") == p){ // check if current cell is same color as the color that is being checked to see if it won (p)
                        chain++;
                    }else{
                        chain = 0;
                    }

                    if(chain >= 4){
                        return true;
                    }
                }
                chain = 0;
            }
            // check column win condition
            chain = 0;
            for(let i = 0; i < 7; i++){
                for(let j = 0; j < 42; j+=7){
                    let cell = $("#" + (i + j));
                    if(cell.attr("data-player") == p){
                        chain++;
                    }else{
                        chain = 0;
                    }

                    if(chain >= 4){
                        return true;
                    }
                }
                chain = 0;
            }

            // check diagonal win condition
            // top left and top right of a 4x4 square
            let topLeft = 0; 
            let topRight = topLeft + 3;

            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 4; j++){
                    // Checks top left to bottom right cell
                    if($("#" + topLeft).attr("data-player") == p
                    && $("#" + (topLeft + 8)).attr("data-player") == p
                    && $("#" + (topLeft + 16)).attr("data-player") == p
                    && $("#" + (topLeft + 24)).attr("data-player") == p){
                        return true;
                    }

                    // Checks top right to bottom left cell
                    if($("#" + topRight).attr("data-player") == p
                    && $("#" + (topRight + 6)).attr("data-player") == p
                    && $("#" + (topRight + 12)).attr("data-player") == p
                    && $("#" + (topRight + 18)).attr("data-player") == p){
                        return true;
                    }
                    // move cell to the right
                    topLeft++;
                    topRight = topLeft + 3;
                }
                // move cell down a row
                topLeft = i * 7 + 7;
                topRight = topLeft + 3;
            }

            // check stalemate condition
            let full = 0;
            for(let i = 0; i < 42; i += 7){  
                for(let j = 0; j < 7; j++){  
                    let cell = $("#" + (i + j));
                    if(cell.attr("data-player") == 1 || cell.attr("data-player") == -1){ 
                        full++;
                    }
                }
            }
            
            if(full == 42){
                alert("Stalemate, no winners!");
                winner = 2;
                playGame();
            }
            return false;
        }
    }
    playGame();
});
