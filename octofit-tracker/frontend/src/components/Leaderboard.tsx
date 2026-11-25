import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Entry = { teamName: string; totalPoints: number; rank: number };
type Payload = { leaderboard: Entry[] };

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getJson<Payload>('/api/leaderboard').then((data) => { if (active) setEntries(data.leaderboard); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return <section className="card h-100"><div className="card-body"><h2 className="h4">Leaderboard</h2>{error ? <p role="alert">Unable to load leaderboard.</p> : entries === null ? <p role="status">Loading leaderboard…</p> : entries.length === 0 ? <p>No leaderboard entries yet.</p> : <ol className="list-group list-group-numbered">{entries.map((entry) => <li className="list-group-item" key={entry.teamName}>{entry.rank}. {entry.teamName} — {entry.totalPoints} points</li>)}</ol>}</div></section>;
}
