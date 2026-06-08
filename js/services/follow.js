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

// Block/unblock
const BLOCK_KEY = STORAGE_KEYS.BLOCKED_USERS;

function getBlocks() {
  const stored = localStorage.getItem(BLOCK_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveBlocks(blocks) {
  localStorage.setItem(BLOCK_KEY, JSON.stringify(blocks));
}

export function blockUser(blockerEmail, blockedEmail) {
  if (blockerEmail === blockedEmail) return false;
  if (isBlocked(blockerEmail, blockedEmail)) return false;
  const blocks = getBlocks();
  blocks.push({ blocker: blockerEmail, blocked: blockedEmail, blockedAt: new Date().toISOString() });
  saveBlocks(blocks);
  return true;
}

export function unblockUser(blockerEmail, blockedEmail) {
  const blocks = getBlocks().filter(b => !(b.blocker === blockerEmail && b.blocked === blockedEmail));
  saveBlocks(blocks);
  return true;
}

export function isBlocked(blockerEmail, blockedEmail) {
  return getBlocks().some(b => b.blocker === blockerEmail && b.blocked === blockedEmail);
}

export function getBlockedEmails(email) {
  return getBlocks().filter(b => b.blocker === email).map(b => b.blocked);
}

export function getBlockerEmails(email) {
  return getBlocks().filter(b => b.blocked === email).map(b => b.blocker);
}
