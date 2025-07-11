import {
  users,
  posts,
  likes,
  comments,
  follows,
  stories,
  notifications,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Like,
  type Follow,
  type Story,
  type InsertStory,
  type Notification,
  type PostWithDetails,
  type UserWithCounts,
  type StoryWithUser,
  type NotificationWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ne, gte, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  getUserWithCounts(id: string): Promise<UserWithCounts | undefined>;
  searchUsers(query: string): Promise<User[]>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<PostWithDetails | undefined>;
  getFeedPosts(userId: string, limit?: number): Promise<PostWithDetails[]>;
  getUserPosts(userId: string): Promise<PostWithDetails[]>;
  getExplorePosts(userId: string, limit?: number): Promise<PostWithDetails[]>;
  deletePost(id: number, userId: string): Promise<boolean>;

  // Like operations
  likePost(userId: string, postId: number): Promise<Like>;
  unlikePost(userId: string, postId: number): Promise<boolean>;
  isPostLiked(userId: string, postId: number): Promise<boolean>;

  // Comment operations
  createComment(comment: InsertComment): Promise<Comment & { user: User }>;
  getPostComments(postId: number): Promise<(Comment & { user: User })[]>;

  // Follow operations
  followUser(followerId: string, followingId: string): Promise<Follow>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;

  // Story operations
  createStory(story: InsertStory): Promise<Story>;
  getActiveStories(userId: string): Promise<StoryWithUser[]>;
  getUserStories(userId: string): Promise<Story[]>;

  // Notification operations
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  getUserNotifications(userId: string): Promise<NotificationWithDetails[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserWithCounts(id: string): Promise<UserWithCounts | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const [postCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.userId, id));

    const [followerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, id));

    const [followingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, id));

    return {
      ...user,
      postCount: postCount.count,
      followerCount: followerCount.count,
      followingCount: followingCount.count,
    };
  }

  async searchUsers(query: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(sql`${users.username} ILIKE ${'%' + query + '%'} OR ${users.firstName} ILIKE ${'%' + query + '%'} OR ${users.lastName} ILIKE ${'%' + query + '%'}`)
      .limit(20);
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPost(id: number): Promise<PostWithDetails | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));

    if (!post) return undefined;

    const postLikes = await db
      .select()
      .from(likes)
      .where(eq(likes.postId, id));

    const postComments = await db
      .select()
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, id))
      .orderBy(desc(comments.createdAt));

    return {
      ...post.posts,
      user: post.users!,
      likes: postLikes,
      comments: postComments.map(c => ({
        ...c.comments,
        user: c.users!,
      })),
      likeCount: postLikes.length,
      commentCount: postComments.length,
    };
  }

  async getFeedPosts(userId: string, limit = 20): Promise<PostWithDetails[]> {
    // Get posts from followed users AND user's own posts
    const feedPosts = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(follows, eq(follows.followingId, posts.userId))
      .where(or(
        eq(follows.followerId, userId), // Posts from followed users
        eq(posts.userId, userId) // User's own posts
      ))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    // Add like and comment counts
    const postsWithDetails = await Promise.all(
      feedPosts.map(async (post) => {
        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.posts.id));

        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.posts.id));

        const [isLiked] = await db
          .select()
          .from(likes)
          .where(and(eq(likes.postId, post.posts.id), eq(likes.userId, userId)));

        return {
          ...post.posts,
          user: post.users!,
          likes: [],
          comments: [],
          isLiked: !!isLiked,
          likeCount: likeCount.count,
          commentCount: commentCount.count,
        };
      })
    );

    return postsWithDetails;
  }

  async getUserPosts(userId: string): Promise<PostWithDetails[]> {
    const userPosts = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));

    const postsWithDetails = await Promise.all(
      userPosts.map(async (post) => {
        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.posts.id));

        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.posts.id));

        return {
          ...post.posts,
          user: post.users!,
          likes: [],
          comments: [],
          likeCount: likeCount.count,
          commentCount: commentCount.count,
        };
      })
    );

    return postsWithDetails;
  }

  async getExplorePosts(userId: string, limit = 30): Promise<PostWithDetails[]> {
    // Get posts from users not followed by current user
    const explorePosts = await db
      .select()
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(ne(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    const postsWithDetails = await Promise.all(
      explorePosts.map(async (post) => {
        const [likeCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.posts.id));

        const [commentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.posts.id));

        return {
          ...post.posts,
          user: post.users!,
          likes: [],
          comments: [],
          likeCount: likeCount.count,
          commentCount: commentCount.count,
        };
      })
    );

    return postsWithDetails;
  }

  async deletePost(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Like operations
  async likePost(userId: string, postId: number): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values({ userId, postId })
      .returning();
    return like;
  }

  async unlikePost(userId: string, postId: number): Promise<boolean> {
    const result = await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return (result.rowCount ?? 0) > 0;
  }

  async isPostLiked(userId: string, postId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return !!like;
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment & { user: User }> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    const user = await this.getUser(comment.userId);
    return { ...newComment, user: user! };
  }

  async getPostComments(postId: number): Promise<(Comment & { user: User })[]> {
    const postComments = await db
      .select()
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return postComments.map(c => ({
      ...c.comments,
      user: c.users!,
    }));
  }

  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<Follow> {
    const [follow] = await db
      .insert(follows)
      .values({ followerId, followingId })
      .returning();
    return follow;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return (result.rowCount ?? 0) > 0;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
    return !!follow;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followers = await db
      .select()
      .from(follows)
      .leftJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId));

    return followers.map(f => f.users!);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const following = await db
      .select()
      .from(follows)
      .leftJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId));

    return following.map(f => f.users!);
  }

  // Story operations
  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async getActiveStories(userId: string): Promise<StoryWithUser[]> {
    const now = new Date();
    const activeStories = await db
      .select()
      .from(stories)
      .leftJoin(users, eq(stories.userId, users.id))
      .leftJoin(follows, eq(follows.followingId, stories.userId))
      .where(and(
        eq(follows.followerId, userId),
        gte(stories.expiresAt, now)
      ))
      .orderBy(desc(stories.createdAt));

    return activeStories.map(s => ({
      ...s.stories,
      user: s.users!,
    }));
  }

  async getUserStories(userId: string): Promise<Story[]> {
    const now = new Date();
    return await db
      .select()
      .from(stories)
      .where(and(eq(stories.userId, userId), gte(stories.expiresAt, now)))
      .orderBy(desc(stories.createdAt));
  }

  // Notification operations
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<NotificationWithDetails[]> {
    const userNotifications = await db
      .select()
      .from(notifications)
      .leftJoin(users, eq(notifications.fromUserId, users.id))
      .leftJoin(posts, eq(notifications.postId, posts.id))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return userNotifications.map(n => ({
      ...n.notifications,
      fromUser: n.users || undefined,
      post: n.posts || undefined,
    }));
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
