
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState } from './HandCricketGame';

interface TossSimulationProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const TossSimulation: React.FC<TossSimulationProps> = ({ gameState, setGameState }) => {
  const [tossInProgress, setTossInProgress] = useState(false);
  const [tossResult, setTossResult] = useState<string | null>(null);
  const [showDecision, setShowDecision] = useState(false);

  const simulateToss = () => {
    setTossInProgress(true);
    
    setTimeout(() => {
      const teams = [gameState.teams.team1!.name, gameState.teams.team2!.name];
      const winner = teams[Math.floor(Math.random() * 2)];
      setTossResult(winner);
      setTossInProgress(false);
      setShowDecision(true);
      
      setGameState({
        ...gameState,
        toss: { ...gameState.toss, winner }
      });
    }, 2000);
  };

  const makeDecision = (decision: 'bat' | 'bowl') => {
    const battingTeam = decision === 'bat' ? tossResult! : 
      gameState.teams.team1!.name === tossResult ? gameState.teams.team2!.name : gameState.teams.team1!.name;
    const bowlingTeam = decision === 'bowl' ? tossResult! :
      gameState.teams.team1!.name === tossResult ? gameState.teams.team2!.name : gameState.teams.team1!.name;

    setGameState({
      ...gameState,
      gamePhase: 'first-innings',
      toss: { winner: tossResult!, decision },
      firstInnings: {
        ...gameState.firstInnings,
        battingTeam,
        bowlingTeam
      },
      commentary: [`${tossResult} won the toss and chose to ${decision} first!`]
    });
  };

  return (
    <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">🪙 Toss Time!</h2>
      
      <div className="mb-8">
        <div className="flex justify-center space-x-8 mb-6">
          <div className={`p-4 rounded-lg bg-gradient-to-r ${gameState.teams.team1!.color}`}>
            <div className="text-2xl mb-2">{gameState.teams.team1!.logo}</div>
            <div className="text-white font-semibold">{gameState.teams.team1!.name}</div>
          </div>
          <div className="flex items-center text-white text-2xl font-bold">VS</div>
          <div className={`p-4 rounded-lg bg-gradient-to-r ${gameState.teams.team2!.color}`}>
            <div className="text-2xl mb-2">{gameState.teams.team2!.logo}</div>
            <div className="text-white font-semibold">{gameState.teams.team2!.name}</div>
          </div>
        </div>
      </div>

      {!tossResult && !tossInProgress && (
        <Button 
          onClick={simulateToss}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg font-semibold"
        >
          Flip the Coin! 🪙
        </Button>
      )}

      {tossInProgress && (
        <div className="text-white">
          <div className="text-6xl animate-spin mb-4">🪙</div>
          <p className="text-xl">Coin is flipping...</p>
        </div>
      )}

      {tossResult && !showDecision && (
        <div className="text-white">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-bold">{tossResult} wins the toss!</p>
        </div>
      )}

      {showDecision && (
        <div className="text-white">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-bold mb-6">{tossResult} wins the toss!</p>
          <p className="text-lg mb-6">What would you like to do?</p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => makeDecision('bat')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              🏏 Bat First
            </Button>
            <Button 
              onClick={() => makeDecision('bowl')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              ⚾ Bowl First
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TossSimulation;
