'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for the leaderboard. In a real application, this would come from a backend.
const leaderboardData = [
  { rank: 1, name: "Greta Thunberg", xp: 10500, rankName: "Plant Master" },
  { rank: 2, name: "David Attenborough", xp: 9800, rankName: "Botanist" },
  { rank: 3, name: "Jane Goodall", xp: 9250, rankName: "Botanist" },
  { rank: 4, name: "User123", xp: 8500, rankName: "Botanist" },
  { rank: 5, name: "PlantLover_99", xp: 7800, rankName: "Botanist" },
  { rank: 6, name: "Farmer Joe", xp: 6200, rankName: "Botanist" },
  { rank: 7, name: "Gardener_Gal", xp: 4500, rankName: "Botanist" },
  { rank: 8, name: "SproutMan", xp: 2100, rankName: "Botanist" },
  { rank: 9, name: "Leafy_Green", xp: 1500, rankName: "Botanist" },
  { rank: 10, name: "Petal_Pusher", xp: 800, rankName: "Botanist" },
];

function getRankColor(rank: number) {
  if (rank === 1) return "text-yellow-500";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-yellow-700";
  return "text-muted-foreground";
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
            <Trophy className="size-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl mt-4">Global Green Ranking</CardTitle>
          <CardDescription className="max-w-xl mx-auto">
            See how you stack up against the best plant caretakers in the world. Keep your plants healthy to climb the ranks!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Gardener</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-center">Rank Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank}>
                  <TableCell className="font-bold text-lg text-center">
                     <div className={`flex items-center justify-center gap-1 ${getRankColor(user.rank)}`}>
                        {user.rank <= 3 && <Award size={20} />}
                        {user.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{user.xp}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{user.rankName}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
