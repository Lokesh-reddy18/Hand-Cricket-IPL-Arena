
import React, { useState, useEffect } from 'react';
import TeamSelection from './TeamSelection';
import TossSimulation from './TossSimulation';
import GamePlay from './GamePlay';
import MatchSummary from './MatchSummary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Team {
  name: string;
  players: string[];
  color: string;
  logo: string;
}

export interface GameState {
  gamePhase: 'team-selection' | 'toss' | 'first-innings' | 'second-innings' | 'match-end';
  teams: {
    team1: Team | null;
    team2: Team | null;
  };
  toss: {
    winner: string;
    decision: 'bat' | 'bowl' | null;
  };
  firstInnings: {
    battingTeam: string;
    bowlingTeam: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    batsmen: string[];
    bowler: string;
    target: number;
  };
  secondInnings: {
    battingTeam: string;
    bowlingTeam: string;
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    batsmen: string[];
    bowler: string;
    target: number;
  };
  winner: string;
  commentary: string[];
}

const teams: Team[] = [
  {
    name: "Mumbai Indians",
    players: ["Rohit Sharma", "Naman Dhir", "Hardik Pandya", "Jasprit Bumrah", "Tilak Varma", "Trent Boult", "Suryakumar Yadav"],
    color: "from-blue-600 to-blue-800",
    logo: "🏏"
  },
  {
    name: "Chennai Super Kings",
    players: ["MS Dhoni", "Shivam Dube", "Dewald Brevis", "Noor Ahmad", "Vijay Shankar", "Ruturaj Gaikwad", "Ravindra Jadeja"],
    color: "from-yellow-500 to-yellow-700",
    logo: "🦁"
  },
  {
    name: "Royal Challengers Bangalore",
    players: ["Virat Kohli", "Philip Salt", "Krunal Pandya", "Rajat Patidar", "Jitesh Sharma", "Tim David", "Josh Hazlewood"],
    color: "from-red-600 to-red-800",
    logo: "👑"
  },
  {
    name: "Sunrisers Hyderabad",
    players: ["Travis Head", "Abhishek Sharma", "Ishan Kishan", "Pat Cummins", "Heinrich Klaseen", "Harshal Patel", "Nitish Kumar Reddy"],
    color: "from-orange-500 to-red-600",
    logo: "☀️"
  }
];

const HandCricketGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    gamePhase: 'team-selection',
    teams: { team1: null, team2: null },
    toss: { winner: '', decision: null },
    firstInnings: {
      battingTeam: '',
      bowlingTeam: '',
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [],
      bowler: '',
      target: 0
    },
    secondInnings: {
      battingTeam: '',
      bowlingTeam: '',
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [],
      bowler: '',
      target: 0
    },
    winner: '',
    commentary: []
  });

  const resetGame = () => {
    setGameState({
      gamePhase: 'team-selection',
      teams: { team1: null, team2: null },
      toss: { winner: '', decision: null },
      firstInnings: {
        battingTeam: '',
        bowlingTeam: '',
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        batsmen: [],
        bowler: '',
        target: 0
      },
      secondInnings: {
        battingTeam: '',
        bowlingTeam: '',
        runs: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        batsmen: [],
        bowler: '',
        target: 0
      },
      winner: '',
      commentary: []
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 p-6 bg-gradient-to-r from-orange-500 to-pink-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">🏏 Hand Cricket IPL</h1>
              <p className="text-lg opacity-90">Experience the thrill of IPL cricket!</p>
            </div>
            <Button 
              onClick={resetGame}
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              New Match
            </Button>
          </div>
        </Card>

        {/* Game Phases */}
        {gameState.gamePhase === 'team-selection' && (
          <TeamSelection 
            teams={teams}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}

        {gameState.gamePhase === 'toss' && (
          <TossSimulation 
            gameState={gameState}
            setGameState={setGameState}
          />
        )}

        {(gameState.gamePhase === 'first-innings' || gameState.gamePhase === 'second-innings') && (
          <GamePlay 
            gameState={gameState}
            setGameState={setGameState}
            teams={teams}
          />
        )}

        {gameState.gamePhase === 'match-end' && (
          <MatchSummary 
            gameState={gameState}
            resetGame={resetGame}
          />
        )}
      </div>
    </div>
  );
};

export default HandCricketGame;
