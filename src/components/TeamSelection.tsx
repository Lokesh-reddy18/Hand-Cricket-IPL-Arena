
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Team, GameState } from './HandCricketGame';

interface TeamSelectionProps {
  teams: Team[];
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, gameState, setGameState }) => {
  const selectTeam = (team: Team, position: 'team1' | 'team2') => {
    const updatedTeams = { ...gameState.teams };
    updatedTeams[position] = team;
    
    setGameState({
      ...gameState,
      teams: updatedTeams
    });
  };

  const proceedToToss = () => {
    if (gameState.teams.team1 && gameState.teams.team2) {
      setGameState({
        ...gameState,
        gamePhase: 'toss'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Select Your Teams</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Team 1 Selection - Player */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Team (Team 1) 
              <span className="text-yellow-300 ml-2">👤 Player</span>
            </h3>
            {gameState.teams.team1 ? (
              <Card className={`p-4 bg-gradient-to-r ${gameState.teams.team1.color} text-white border-2 border-yellow-400`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{gameState.teams.team1.logo}</span>
                    <h4 className="font-bold">{gameState.teams.team1.name}</h4>
                    <span className="text-yellow-300">👤</span>
                  </div>
                  <Button 
                    onClick={() => selectTeam(gameState.teams.team1!, 'team1')}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-gray-800"
                  >
                    Change
                  </Button>
                </div>
                <div className="text-sm opacity-90">
                  <p className="font-medium mb-1">Squad:</p>
                  <p>{gameState.teams.team1.players.join(', ')}</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-3">
                {teams.map((team) => (
                  <Card 
                    key={team.name}
                    className={`p-3 bg-gradient-to-r ${team.color} text-white cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => selectTeam(team, 'team1')}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{team.logo}</span>
                      <span className="font-semibold">{team.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Team 2 Selection - Computer */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Computer Team (Team 2) 
              <span className="text-blue-300 ml-2">🤖 Computer</span>
            </h3>
            {gameState.teams.team2 ? (
              <Card className={`p-4 bg-gradient-to-r ${gameState.teams.team2.color} text-white border-2 border-blue-400`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{gameState.teams.team2.logo}</span>
                    <h4 className="font-bold">{gameState.teams.team2.name}</h4>
                    <span className="text-blue-300">🤖</span>
                  </div>
                  <Button 
                    onClick={() => selectTeam(gameState.teams.team2!, 'team2')}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-gray-800"
                  >
                    Change
                  </Button>
                </div>
                <div className="text-sm opacity-90">
                  <p className="font-medium mb-1">Squad:</p>
                  <p>{gameState.teams.team2.players.join(', ')}</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-3">
                {teams.filter(team => team.name !== gameState.teams.team1?.name).map((team) => (
                  <Card 
                    key={team.name}
                    className={`p-3 bg-gradient-to-r ${team.color} text-white cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => selectTeam(team, 'team2')}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{team.logo}</span>
                      <span className="font-semibold">{team.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {gameState.teams.team1 && gameState.teams.team2 && (
          <div className="text-center mt-8">
            <div className="mb-4 text-white text-lg">
              <span className="text-yellow-300">👤 {gameState.teams.team1.name}</span> vs <span className="text-blue-300">🤖 {gameState.teams.team2.name}</span>
            </div>
            <Button 
              onClick={proceedToToss}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Proceed to Toss 🪙
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeamSelection;
