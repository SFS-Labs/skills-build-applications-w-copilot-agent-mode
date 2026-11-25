import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

function badRequest(message: string) {
  return Object.assign(new Error(message), { status: 400 });
}

function notFound(message: string) {
  return Object.assign(new Error(message), { status: 404 });
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  const body = (input ?? {}) as { userId?: unknown; teamId?: unknown; type?: unknown; minutes?: unknown };
  if (typeof body.userId !== 'string' || typeof body.teamId !== 'string') throw badRequest('userId and teamId are required');
  if (!mongoose.isValidObjectId(body.userId) || !mongoose.isValidObjectId(body.teamId)) throw badRequest('userId and teamId must be valid IDs');
  if (typeof body.type !== 'string' || !body.type.trim()) throw badRequest('type is required');
  const minutes = Number(body.minutes);
  if (!Number.isFinite(minutes) || minutes <= 0) throw badRequest('minutes must be a positive number');
  const [user, team] = await Promise.all([User.findById(body.userId), Team.findById(body.teamId)]);
  if (!user || !team) throw badRequest('userId and teamId must reference existing records');
  const activity = await Activity.create({ user: user._id, team: team._id, type: body.type.trim(), minutes, points: Math.round(minutes), occurredAt: new Date() });
  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const body = (input ?? {}) as { name?: unknown; mascot?: unknown; members?: unknown };
  if (typeof body.name !== 'string' || !body.name.trim()) throw badRequest('name is required');
  if (typeof body.mascot !== 'string' || !body.mascot.trim()) throw badRequest('mascot is required');
  let members: mongoose.Types.ObjectId[] = [];
  if (body.members !== undefined) {
    if (!Array.isArray(body.members) || body.members.some((id) => typeof id !== 'string' || !mongoose.isValidObjectId(id))) throw badRequest('members must be an array of valid user IDs');
    members = body.members.map((id) => new mongoose.Types.ObjectId(id as string));
  }
  const team = await Team.create({ name: body.name.trim(), mascot: body.mascot.trim(), members });
  return team.toObject();
}

export async function getLeaderboard() {
  const rows = await Activity.aggregate([
    { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $project: { _id: 0, teamName: '$team.name', totalPoints: 1 } },
    { $sort: { totalPoints: -1 } },
  ]);
  return rows.map((row, index) => ({ teamName: row.teamName, totalPoints: row.totalPoints, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: decodeURIComponent(userEmail).toLowerCase() }).lean();
  if (!user) throw notFound('No user found for that email');
  const recent = await Activity.findOne({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const focus = user.fitnessGoal || (recent?.type === 'run' || recent?.type === 'cycle' ? 'endurance' : recent?.type);
  let workouts = focus ? await Workout.find({ focus }).lean() : [];
  if (!workouts.length) workouts = await Workout.find().limit(1).lean();
  return workouts.map((workout) => ({ ...workout, reason: `Matches your ${focus ?? 'activity'} goal and recent ${recent?.type ?? 'activity'} activity.` }));
}

export { User };
