import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Workout = { title: string; focus?: string; minutes?: number; reason: string };
type Payload = { suggestions: Workout[] };

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getJson<Payload>(`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`).then((data) => { if (active) setWorkouts(data.suggestions); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return <section className="card h-100"><div className="card-body"><h2 className="h4">Workout suggestions</h2>{error ? <p role="alert">Unable to load workout suggestions.</p> : workouts === null ? <p role="status">Loading workout suggestions…</p> : workouts.length === 0 ? <p>No workout suggestions yet.</p> : <ul className="list-group">{workouts.map((workout) => <li className="list-group-item" key={workout.title}><strong>{workout.title}</strong> — {workout.reason}</li>)}</ul>}</div></section>;
}
