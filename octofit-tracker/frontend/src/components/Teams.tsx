import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Team = { name: string; mascot?: string; members?: string[] };
type Payload = { teams: Team[] };

export default function Teams() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getJson<Payload>('/api/teams').then((data) => { if (active) setTeams(data.teams); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return <section className="card h-100"><div className="card-body"><h2 className="h4">Teams</h2>{error ? <p role="alert">Unable to load teams.</p> : teams === null ? <p role="status">Loading teams…</p> : teams.length === 0 ? <p>No teams yet.</p> : <ul className="list-group">{teams.map((team) => <li className="list-group-item" key={team.name}>{team.name} {team.members?.length ? `· ${team.members.length} members` : ''}</li>)}</ul>}</div></section>;
}
