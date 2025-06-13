import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState, Team } from './HandCricketGame';
import ScoreCard from './ScoreCard';

interface GamePlayProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  teams: Team[];
}

const GamePlay: React.FC<GamePlayProps> = ({ gameState, setGameState, teams }) => {
  const [userInput, setUserInput] = useState<number | null>(null);
  const [computerInput, setComputerInput] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [ballInProgress, setBallInProgress] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectionType, setSelectionType] = useState<'batsmen' | 'bowler'>('batsmen');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showScorecard, setShowScorecard] = useState(false);

  const isFirstInnings = gameState.gamePhase === 'first-innings';
  const currentInnings = isFirstInnings ? gameState.firstInnings : gameState.secondInnings;
  
  const battingTeam = teams.find(team => team.name === currentInnings.battingTeam);
  const bowlingTeam = teams.find(team => team.name === currentInnings.bowlingTeam);
  
  // Check if player is batting (Team 1 is always player's team)
  const isPlayerBatting = battingTeam?.name === gameState.teams.team1?.name;
  const isPlayerBowling = bowlingTeam?.name === gameState.teams.team1?.name;

  // Initialize players if not set
  useEffect(() => {
    if (currentInnings.batsmen.length === 0 && battingTeam) {
      if (isPlayerBatting) {
        // Player is batting - show selection
        setSelectionType('batsmen');
        setShowPlayerSelection(true);
      } else {
        // Computer is batting - auto select
        const randomBatsmen = battingTeam.players
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        
        const updatedGameState = { ...gameState };
        if (isFirstInnings) {
          updatedGameState.firstInnings.batsmen = randomBatsmen;
        } else {
          updatedGameState.secondInnings.batsmen = randomBatsmen;
        }
        setGameState(updatedGameState);
      }
    }
    
    if (!currentInnings.bowler && bowlingTeam) {
      if (isPlayerBowling && currentInnings.batsmen.length > 0) {
        // Player is bowling - show selection
        setSelectionType('bowler');
        setShowPlayerSelection(true);
      } else if (!isPlayerBowling) {
        // Computer is bowling - auto select
        const randomBowler = bowlingTeam.players[Math.floor(Math.random() * bowlingTeam.players.length)];
        
        const updatedGameState = { ...gameState };
        if (isFirstInnings) {
          updatedGameState.firstInnings.bowler = randomBowler;
        } else {
          updatedGameState.secondInnings.bowler = randomBowler;
        }
        setGameState(updatedGameState);
      }
    }
  }, [currentInnings.batsmen.length, currentInnings.bowler, battingTeam, bowlingTeam]);

  const selectPlayers = (players: string[]) => {
    const updatedGameState = { ...gameState };
    
    if (selectionType === 'batsmen') {
      if (isFirstInnings) {
        updatedGameState.firstInnings.batsmen = players;
      } else {
        updatedGameState.secondInnings.batsmen = players;
      }
      
      // If player is also bowling, show bowler selection next
      if (isPlayerBowling) {
        setSelectionType('bowler');
        setSelectedPlayers([]);
      } else {
        // Computer is bowling, auto-select bowler
        const randomBowler = bowlingTeam!.players[Math.floor(Math.random() * bowlingTeam!.players.length)];
        if (isFirstInnings) {
          updatedGameState.firstInnings.bowler = randomBowler;
        } else {
          updatedGameState.secondInnings.bowler = randomBowler;
        }
        setShowPlayerSelection(false);
        setSelectedPlayers([]);
      }
    } else {
      // Selecting bowler
      if (isFirstInnings) {
        updatedGameState.firstInnings.bowler = players[0];
      } else {
        updatedGameState.secondInnings.bowler = players[0];
      }
      setShowPlayerSelection(false);
      setSelectedPlayers([]);
    }
    
    setGameState(updatedGameState);
  };

  const playBall = (userChoice: number) => {
    if (ballInProgress) return;
    
    setBallInProgress(true);
    
    // Determine who chooses what based on batting/bowling
    let playerChoice: number;
    let computerChoice: number;
    
    if (isPlayerBatting) {
      // Player is batting, computer is bowling
      playerChoice = userChoice; // Player's batting choice
      computerChoice = Math.floor(Math.random() * 6) + 1; // Computer's bowling choice
    } else {
      // Player is bowling, computer is batting
      playerChoice = userChoice; // Player's bowling choice
      computerChoice = Math.floor(Math.random() * 6) + 1; // Computer's batting choice
    }
    
    setUserInput(playerChoice);
    
    setTimeout(() => {
      setComputerInput(computerChoice);
      setShowResult(true);
      
      setTimeout(() => {
        processResult(playerChoice, computerChoice);
        setBallInProgress(false);
        setShowResult(false);
        setUserInput(null);
        setComputerInput(null);
      }, 1500);
    }, 1000);
  };

  const processResult = (playerChoice: number, computerChoice: number) => {
    const updatedGameState = { ...gameState };
    const innings = isFirstInnings ? updatedGameState.firstInnings : updatedGameState.secondInnings;
    
    let commentary = '';
    
    if (playerChoice === computerChoice) {
      // Wicket!
      innings.wickets++;
      commentary = `WICKET! ${innings.batsmen[0]} is out! ${playerChoice} vs ${computerChoice}`;
      
      // Change batsman if wickets < 5
      if (innings.wickets < 5 && battingTeam) {
        if (isPlayerBatting) {
          // Player needs to select new batsman
          const availablePlayers = battingTeam.players.filter(p => !innings.batsmen.includes(p));
          if (availablePlayers.length > 0) {
            // For now, auto-select the next player (could add selection UI later)
            innings.batsmen[0] = availablePlayers[0];
          }
        } else {
          // Computer team - auto select
          const availablePlayers = battingTeam.players.filter(p => !innings.batsmen.includes(p));
          if (availablePlayers.length > 0) {
            innings.batsmen[0] = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
          }
        }
      }
    } else {
      // Runs scored
      const runs = isPlayerBatting ? playerChoice : computerChoice;
      innings.runs += runs;
      commentary = `${runs} runs scored! Current score: ${innings.runs}/${innings.wickets}`;
    }

    // Update balls and overs
    innings.balls++;
    if (innings.balls === 6) {
      innings.overs++;
      innings.balls = 0;
      
      // Change bowler
      if (bowlingTeam) {
        if (isPlayerBowling) {
          // Player needs to select new bowler
          const availableBowlers = bowlingTeam.players.filter(p => p !== innings.bowler);
          if (availableBowlers.length > 0) {
            setSelectionType('bowler');
            setShowPlayerSelection(true);
            setSelectedPlayers([]);
            return; // Don't continue until bowler is selected
          }
        } else {
          // Computer team - auto select
          const availableBowlers = bowlingTeam.players.filter(p => p !== innings.bowler);
          if (availableBowlers.length > 0) {
            innings.bowler = availableBowlers[Math.floor(Math.random() * availableBowlers.length)];
          }
        }
      }
    }

    // Check if innings should end
    const shouldEndInnings = innings.overs >= 6 || innings.wickets >= 5 || 
      (!isFirstInnings && innings.runs > gameState.firstInnings.runs);

    if (shouldEndInnings) {
      if (isFirstInnings) {
        updatedGameState.gamePhase = 'second-innings';
        updatedGameState.secondInnings = {
          battingTeam: gameState.firstInnings.bowlingTeam,
          bowlingTeam: gameState.firstInnings.battingTeam,
          runs: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          batsmen: [],
          bowler: '',
          target: innings.runs + 1
        };
        commentary += ` First innings ends! Target: ${innings.runs + 1}`;
      } else {
        // Match ends
        const firstInningsRuns = gameState.firstInnings.runs;
        const secondInningsRuns = innings.runs;
        
        if (secondInningsRuns > firstInningsRuns) {
          updatedGameState.winner = innings.battingTeam;
          commentary += ` ${innings.battingTeam} wins by ${5 - innings.wickets} wickets!`;
        } else if (secondInningsRuns < firstInningsRuns) {
          updatedGameState.winner = gameState.firstInnings.battingTeam;
          commentary += ` ${gameState.firstInnings.battingTeam} wins by ${firstInningsRuns - secondInningsRuns} runs!`;
        } else {
          updatedGameState.winner = 'Tie';
          commentary += ' Match tied!';
        }
        updatedGameState.gamePhase = 'match-end';
      }
    }

    updatedGameState.commentary = [commentary, ...gameState.commentary.slice(0, 9)];
    setGameState(updatedGameState);
  };

  const formatOvers = (overs: number, balls: number) => {
    return `${overs}.${balls}`;
  };

  // Player selection UI
  if (showPlayerSelection) {
    const teamToSelect = selectionType === 'batsmen' ? battingTeam : bowlingTeam;
    const maxSelections = selectionType === 'batsmen' ? 2 : 1;

    return (
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Select Your {selectionType === 'batsmen' ? 'Batsmen (2)' : 'Bowler (1)'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {teamToSelect?.players.map((player) => (
            <Button
              key={player}
              onClick={() => {
                if (selectedPlayers.includes(player)) {
                  setSelectedPlayers(selectedPlayers.filter(p => p !== player));
                } else if (selectedPlayers.length < maxSelections) {
                  setSelectedPlayers([...selectedPlayers, player]);
                }
              }}
              className={`p-3 text-sm ${
                selectedPlayers.includes(player) 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {player}
            </Button>
          ))}
        </div>
        
        <div className="text-center">
          <Button
            onClick={() => selectPlayers(selectedPlayers)}
            disabled={selectedPlayers.length !== maxSelections}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            Confirm Selection
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle Scorecard Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowScorecard(!showScorecard)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
        >
          {showScorecard ? '📊 Hide Scorecard' : '📊 Show Scorecard'}
        </Button>
      </div>

      {/* Scorecard */}
      {showScorecard && (
        <ScoreCard gameState={gameState} teams={teams} />
      )}

      {/* Scoreboard */}
      <Card className={`p-6 bg-gradient-to-r ${battingTeam?.color} text-white`}>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {battingTeam?.name} {battingTeam?.logo} 
              {isPlayerBatting && <span className="text-yellow-300"> (You)</span>}
            </h3>
            <div className="text-3xl font-bold">{currentInnings.runs}/{currentInnings.wickets}</div>
            <div className="text-lg">({formatOvers(currentInnings.overs, currentInnings.balls)} overs)</div>
            {!isFirstInnings && (
              <div className="text-lg">Target: {currentInnings.target}</div>
            )}
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold mb-2">Current Players</h4>
            <div className="space-y-1">
              <div>🏏 {currentInnings.batsmen[0]}</div>
              <div>🏏 {currentInnings.batsmen[1]}</div>
              <div>
                ⚾ {currentInnings.bowler} ({bowlingTeam?.name})
                {isPlayerBowling && <span className="text-yellow-300"> (You)</span>}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold mb-2">Match Status</h4>
            <div>{isFirstInnings ? '1st Innings' : '2nd Innings'}</div>
            <div className="text-sm opacity-90">6 overs match</div>
          </div>
        </div>
      </Card>

      {/* Ball Input */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          {ballInProgress ? "Ball in progress..." : 
           isPlayerBatting ? "Choose your batting number (1-6)" : 
           "Choose your bowling number (1-6)"}
        </h3>
        
        {showResult && (
          <div className="text-center mb-6">
            <div className="text-white text-lg mb-2">
              {isPlayerBatting ? "Your batting" : "Your bowling"}: <span className="text-2xl font-bold text-yellow-400">{userInput}</span>
            </div>
            <div className="text-white text-lg">
              {isPlayerBatting ? "Computer bowling" : "Computer batting"}: <span className="text-2xl font-bold text-yellow-400">{computerInput}</span>
            </div>
            <div className="text-xl font-bold text-white mt-2">
              {userInput === computerInput ? "🚫 WICKET!" : 
               isPlayerBatting ? `✅ ${userInput} RUNS!` : `✅ ${computerInput} RUNS!`}
            </div>
          </div>
        )}

        {!ballInProgress && (
          <div className="grid grid-cols-6 gap-3 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                key={num}
                onClick={() => playBall(num)}
                className="aspect-square text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {num}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {/* Commentary */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📢 Live Commentary</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {gameState.commentary.map((comment, index) => (
            <div key={index} className="text-white text-sm p-2 bg-white/10 rounded">
              {comment}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GamePlay;
