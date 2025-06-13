
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GameState, Team } from './HandCricketGame';

interface ScoreCardProps {
  gameState: GameState;
  teams: Team[];
}

const ScoreCard: React.FC<ScoreCardProps> = ({ gameState, teams }) => {
  const isFirstInnings = gameState.gamePhase === 'first-innings';
  const currentInnings = isFirstInnings ? gameState.firstInnings : gameState.secondInnings;
  
  // Get player statistics from commentary with improved parsing
  const getPlayerStats = () => {
    const batsmenStats: { [key: string]: { runs: number, ballsFaced: number, isOut: boolean } } = {};
    const bowlerStats: { [key: string]: { overs: number, runs: number, wickets: number, ballsBowled: number } } = {};
    
    // Initialize all team players with zero stats
    const battingTeam = teams.find(team => team.name === currentInnings.battingTeam);
    const bowlingTeam = teams.find(team => team.name === currentInnings.bowlingTeam);
    
    if (battingTeam) {
      battingTeam.players.forEach(player => {
        batsmenStats[player] = { runs: 0, ballsFaced: 0, isOut: false };
      });
    }
    
    if (bowlingTeam) {
      bowlingTeam.players.forEach(player => {
        bowlerStats[player] = { overs: 0, runs: 0, wickets: 0, ballsBowled: 0 };
      });
    }
    
    // Track current players (start with the first batsmen and bowler)
    let currentBatsman = currentInnings.batsmen[0] || '';
    let currentBowler = currentInnings.bowler || '';
    
    // Parse commentary in reverse order (oldest first) to track progression correctly
    const reversedCommentary = [...gameState.commentary].reverse();
    
    reversedCommentary.forEach((comment, index) => {
      console.log(`Processing comment ${index}: ${comment}`);
      
      // Look for run scoring patterns
      const runsMatch = comment.match(/(\d+) runs? scored!/);
      if (runsMatch) {
        const runs = parseInt(runsMatch[1]);
        console.log(`Found ${runs} runs for batsman: ${currentBatsman}, bowler: ${currentBowler}`);
        
        // Add runs to current batsman
        if (currentBatsman && batsmenStats[currentBatsman]) {
          batsmenStats[currentBatsman].runs += runs;
          batsmenStats[currentBatsman].ballsFaced += 1;
        }
        
        // Add runs conceded to current bowler
        if (currentBowler && bowlerStats[currentBowler]) {
          bowlerStats[currentBowler].runs += runs;
          bowlerStats[currentBowler].ballsBowled += 1;
        }
        return;
      }
      
      // Look for wicket patterns
      const wicketMatch = comment.match(/WICKET! (.+?) is out!/);
      if (wicketMatch) {
        const playerOut = wicketMatch[1];
        console.log(`Found wicket: ${playerOut}, current bowler: ${currentBowler}`);
        
        if (batsmenStats[playerOut]) {
          batsmenStats[playerOut].isOut = true;
          batsmenStats[playerOut].ballsFaced += 1;
        }
        
        // Add wicket to current bowler
        if (currentBowler && bowlerStats[currentBowler]) {
          bowlerStats[currentBowler].wickets += 1;
          bowlerStats[currentBowler].ballsBowled += 1;
        }
        
        // Update current batsman to next available batsman
        const nextBatsman = currentInnings.batsmen.find(b => b !== playerOut && !batsmenStats[b]?.isOut);
        if (nextBatsman) {
          currentBatsman = nextBatsman;
          console.log(`New batsman: ${currentBatsman}`);
        }
        return;
      }
      
      // Look for over completion and bowler changes
      if (comment.includes('overs match') || comment.includes('First innings ends') || comment.includes('wins by')) {
        // Skip match status comments
        return;
      }
      
      // Check for dot balls or other ball outcomes
      if (comment.includes('vs') && !runsMatch && !wicketMatch) {
        console.log(`Dot ball or no-score: ${comment}`);
        // This is likely a dot ball or other outcome
        if (currentBatsman && batsmenStats[currentBatsman]) {
          batsmenStats[currentBatsman].ballsFaced += 1;
        }
        if (currentBowler && bowlerStats[currentBowler]) {
          bowlerStats[currentBowler].ballsBowled += 1;
        }
      }
    });
    
    // Calculate overs for bowlers
    Object.keys(bowlerStats).forEach(bowler => {
      const ballsBowled = bowlerStats[bowler].ballsBowled;
      bowlerStats[bowler].overs = Math.floor(ballsBowled / 6) + (ballsBowled % 6) / 10;
    });
    
    console.log('Final batsmen stats:', batsmenStats);
    console.log('Final bowler stats:', bowlerStats);
    
    return { batsmenStats, bowlerStats };
  };

  const { batsmenStats, bowlerStats } = getPlayerStats();
  
  const battingTeam = teams.find(team => team.name === currentInnings.battingTeam);
  const bowlingTeam = teams.find(team => team.name === currentInnings.bowlingTeam);

  // Get players who have actually played or are currently playing
  const activeBatsmen = battingTeam?.players.filter(player => 
    batsmenStats[player] && (
      batsmenStats[player].ballsFaced > 0 || 
      batsmenStats[player].runs > 0 ||
      currentInnings.batsmen.includes(player)
    )
  ) || [];
  
  const activeBowlers = bowlingTeam?.players.filter(player => 
    bowlerStats[player] && (
      bowlerStats[player].ballsBowled > 0 || 
      bowlerStats[player].wickets > 0 ||
      player === currentInnings.bowler
    )
  ) || [];

  return (
    <div className="space-y-6">
      {/* Batting Scorecard */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">
          🏏 {battingTeam?.name} - Batting Scorecard
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Batsman</TableHead>
              <TableHead className="text-white">Runs</TableHead>
              <TableHead className="text-white">Balls</TableHead>
              <TableHead className="text-white">Strike Rate</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeBatsmen.map((batsman) => {
              const stats = batsmenStats[batsman] || { runs: 0, ballsFaced: 0, isOut: false };
              const strikeRate = stats.ballsFaced > 0 ? ((stats.runs / stats.ballsFaced) * 100).toFixed(1) : '0.0';
              const isCurrentBatsman = currentInnings.batsmen.includes(batsman);
              
              return (
                <TableRow key={batsman}>
                  <TableCell className="text-white font-medium">
                    {batsman} {isCurrentBatsman && !stats.isOut ? '🏏' : ''}
                  </TableCell>
                  <TableCell className="text-white">{stats.runs}</TableCell>
                  <TableCell className="text-white">{stats.ballsFaced}</TableCell>
                  <TableCell className="text-white">{strikeRate}</TableCell>
                  <TableCell className="text-white">
                    {stats.isOut ? '❌ Out' : (isCurrentBatsman ? '⚡ Batting' : '✅ Not Out')}
                  </TableCell>
                </TableRow>
              );
            })}
            {activeBatsmen.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-white text-center">
                  No batting statistics available yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Bowling Scorecard */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">
          ⚾ {bowlingTeam?.name} - Bowling Scorecard
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Bowler</TableHead>
              <TableHead className="text-white">Overs</TableHead>
              <TableHead className="text-white">Runs</TableHead>
              <TableHead className="text-white">Wickets</TableHead>
              <TableHead className="text-white">Economy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeBowlers.map((bowler) => {
              const stats = bowlerStats[bowler] || { overs: 0, runs: 0, wickets: 0, ballsBowled: 0 };
              const economy = stats.overs > 0 ? (stats.runs / stats.overs).toFixed(1) : '0.0';
              const isCurrentBowler = bowler === currentInnings.bowler;
              const oversDisplay = Math.floor(stats.ballsBowled / 6) + '.' + (stats.ballsBowled % 6);
              
              return (
                <TableRow key={bowler}>
                  <TableCell className="text-white font-medium">
                    {bowler} {isCurrentBowler ? '⚾' : ''}
                  </TableCell>
                  <TableCell className="text-white">{oversDisplay}</TableCell>
                  <TableCell className="text-white">{stats.runs}</TableCell>
                  <TableCell className="text-white">{stats.wickets}</TableCell>
                  <TableCell className="text-white">{economy}</TableCell>
                </TableRow>
              );
            })}
            {activeBowlers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-white text-center">
                  No bowling statistics available yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ScoreCard;
