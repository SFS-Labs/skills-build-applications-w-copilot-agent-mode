import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Activity = { type: string; minutes: number; points: number };
type Payload = { activities: Activity[] };

export default function Activities() {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getJson<Payload>('/api/activities').then((data) => { if (active) setActivities(data.activities); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return <section className="card h-100"><div className="card-body"><h2 className="h4">Activities</h2>{error ? <p role="alert">Unable to load activities.</p> : activities === null ? <p role="status">Loading activities…</p> : activities.length === 0 ? <p>No activities yet.</p> : <ul className="list-group">{activities.map((activity, index) => <li className="list-group-item" key={index}>{activity.type}: {activity.minutes} minutes ({activity.points} points)</li>)}</ul>}</div></section>;
}
