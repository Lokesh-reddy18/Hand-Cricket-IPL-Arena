
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState } from './HandCricketGame';

interface MatchSummaryProps {
  gameState: GameState;
  resetGame: () => void;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({ gameState, resetGame }) => {
  const { firstInnings, secondInnings, winner } = gameState;
  
  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 text-center">
        <div className="text-6xl mb-4">
          {winner === 'Tie' ? '🤝' : '🏆'}
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-6">
          {winner === 'Tie' ? 'Match Tied!' : `${winner} Wins!`}
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* First Innings Summary */}
          <Card className="p-6 bg-blue-600/20">
            <h3 className="text-xl font-bold text-white mb-4">1st Innings</h3>
            <div className="text-white">
              <div className="text-2xl font-bold mb-2">
                {firstInnings.battingTeam}: {firstInnings.runs}/{firstInnings.wickets}
              </div>
              <div className="text-lg">
                ({firstInnings.overs}.{firstInnings.balls} overs)
              </div>
            </div>
          </Card>

          {/* Second Innings Summary */}
          <Card className="p-6 bg-green-600/20">
            <h3 className="text-xl font-bold text-white mb-4">2nd Innings</h3>
            <div className="text-white">
              <div className="text-2xl font-bold mb-2">
                {secondInnings.battingTeam}: {secondInnings.runs}/{secondInnings.wickets}
              </div>
              <div className="text-lg">
                ({secondInnings.overs}.{secondInnings.balls} overs)
              </div>
              <div className="text-sm opacity-80">
                Target: {secondInnings.target}
              </div>
            </div>
          </Card>
        </div>

        {/* Match Statistics */}
        <Card className="p-6 bg-purple-600/20 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Match Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-white">
            <div>
              <div className="font-semibold">Highest Score:</div>
              <div>{Math.max(firstInnings.runs, secondInnings.runs)} runs</div>
            </div>
            <div>
              <div className="font-semibold">Total Wickets:</div>
              <div>{firstInnings.wickets + secondInnings.wickets}</div>
            </div>
          </div>
        </Card>

        <div className="space-x-4">
          <Button 
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            🔄 Play Again
          </Button>
        </div>
      </Card>

      {/* Full Commentary */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📜 Full Match Commentary</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {gameState.commentary.slice().reverse().map((comment, index) => (
            <div key={index} className="text-white text-sm p-2 bg-white/10 rounded">
              {comment}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MatchSummary;
