import { getUsers } from './auth.js';
import { STORAGE_KEYS } from '../core/config.js';

const USER_FOLLOWS_KEY = STORAGE_KEYS.USER_FOLLOWS;

function getFollows() {
  const stored = localStorage.getItem(USER_FOLLOWS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFollows(follows) {
  localStorage.setItem(USER_FOLLOWS_KEY, JSON.stringify(follows));
}

function emailToName(email) {
  const users = getUsers();
  const u = users.find(u => u.email === email);
  return u ? u.name : email;
}

function nameToEmail(name) {
  const users = getUsers();
  const u = users.find(u => u.name === name);
  return u ? u.email : name;
}

export function getFollowing(email) {
  return getFollows().filter(f => f.follower === email).map(f => f.following);
}

export function getFollowers(email) {
  return getFollows().filter(f => f.following === email).map(f => f.follower);
}

export function getFriends(email) {
  const following = getFollowing(email);
  const followers = getFollowers(email);
  const friendEmails = following.filter(e => followers.includes(e));
  return friendEmails;
}

export function getFriendNames(email) {
  return getFriends(email).map(emailToName);
}

export { emailToName, nameToEmail };

export function isFollowing(followerEmail, followingEmail) {
  return getFollows().some(f => f.follower === followerEmail && f.following === followingEmail);
}

export function followUser(followerEmail, followingEmail) {
  if (followerEmail === followingEmail) return false;
  if (isFollowing(followerEmail, followingEmail)) return false;
  const follows = getFollows();
  follows.push({ follower: followerEmail, following: followingEmail, followedAt: new Date().toISOString() });
  saveFollows(follows);
  return true;
}

export function unfollowUser(followerEmail, followingEmail) {
  const follows = getFollows().filter(f => !(f.follower === followerEmail && f.following === followingEmail));
  saveFollows(follows);
  return true;
}

export function toggleFollowUser(followerEmail, followingEmail) {
  if (isFollowing(followerEmail, followingEmail)) {
    unfollowUser(followerEmail, followingEmail);
    return false;
  }
  followUser(followerEmail, followingEmail);
  return true;
}

export function getFollowingCount(email) {
  return getFollowing(email).length;
}

export function getFollowersCount(email) {
  return getFollowers(email).length;
}

export function getAllUserFollows() {
  return getFollows();
}
