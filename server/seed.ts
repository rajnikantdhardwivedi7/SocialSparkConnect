import { db } from "./db";
import { users, posts, follows, likes, comments } from "@shared/schema";
import { eq } from "drizzle-orm";

const RAJNIKANT_USER_ID = "rajnikant_user_id";

// Sample users data
const sampleUsers = [
  {
    id: "user_1",
    email: "emma@example.com",
    username: "emma_art",
    firstName: "Emma",
    lastName: "Wilson",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "Digital artist & photographer 🎨\nCapturing moments in time",
    website: "https://emmaart.com",
  },
  {
    id: "user_2", 
    email: "alex@example.com",
    username: "alex_photo",
    firstName: "Alex",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "Travel photographer 📸\nExploring the world one shot at a time",
    website: "https://alexphoto.com",
  },
  {
    id: "user_3",
    email: "sarah@example.com", 
    username: "sarah_design",
    firstName: "Sarah",
    lastName: "Miller",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b056c5b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "UI/UX Designer ✨\nCreating beautiful digital experiences",
    website: "https://sarahdesign.io",
  }
];

// Sample posts data
const samplePosts = [
  {
    userId: "user_1",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    caption: "Golden hour magic ✨ There's something so peaceful about watching the sunset paint the sky. #sunset #goldenhour #photography",
    location: "California Coast",
  },
  {
    userId: "user_2", 
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    caption: "Mountain adventure day! The view from the top was absolutely breathtaking 🏔️ #mountains #hiking #adventure #nature",
    location: "Rocky Mountains",
  },
  {
    userId: "user_3",
    imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    caption: "Working on some new design concepts today ⚡ Love how this color palette turned out! #design #ui #creativity",
    location: "Design Studio",
  },
  {
    userId: "user_1",
    imageUrl: "https://images.unsplash.com/photo-1526935050-f8b34ce87098?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    caption: "Coffee and creativity go hand in hand ☕ Starting the day with some sketching #coffee #art #morning",
    location: "Local Café",
  }
];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Check if Rajnikant's user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, RAJNIKANT_USER_ID));

    if (existingUser) {
      console.log("✅ Rajnikant's profile already exists");
    } else {
      // Create Rajnikant's profile
      await db.insert(users).values({
        id: RAJNIKANT_USER_ID,
        email: "rajnikant@example.com",
        username: "rajnikant_dhar_dwivedi",
        firstName: "Rajnikant",
        lastName: "Dhar Dwivedi",
        profileImageUrl: "/attached_assets/IMG_20250607_015958_1752226457326.jpg",
        bio: "Full-stack developer passionate about creating amazing web experiences 🚀\nBuilding the future, one line of code at a time.",
        website: "https://github.com/rajnikant",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Created Rajnikant's profile");
    }

    // Create sample users
    for (const userData of sampleUsers) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id));

      if (!existingUser) {
        await db.insert(users).values({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created user: ${userData.username}`);
      }
    }

    // Check if initial post exists
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, RAJNIKANT_USER_ID));

    if (existingPost) {
      console.log("✅ Rajnikant's initial post already exists");
    } else {
      // Create initial post
      await db.insert(posts).values({
        userId: RAJNIKANT_USER_ID,
        imageUrl: "/attached_assets/IMG_20250607_015958_1752226457326.jpg",
        caption: "Welcome to my Instagram clone! 📸✨\n\nBuilt with React, TypeScript, and Express - featuring all the core Instagram functionality you love. This is my first post on this amazing platform I created!\n\n#webdevelopment #react #typescript #instagram #coding #fullstack",
        location: "Developer's Workspace",
        createdAt: new Date(),
      });
      console.log("✅ Created Rajnikant's initial post");
    }

    // Create sample posts
    for (const postData of samplePosts) {
      const existingPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, postData.userId));

      if (existingPosts.length === 0) {
        await db.insert(posts).values({
          ...postData,
          createdAt: new Date(),
        });
        console.log(`✅ Created post by: ${postData.userId}`);
      }
    }

    // Create some follow relationships (sample users follow Rajnikant)
    for (const userData of sampleUsers) {
      const [existingFollow] = await db
        .select()
        .from(follows)
        .where(eq(follows.followerId, userData.id));

      if (!existingFollow) {
        await db.insert(follows).values({
          followerId: userData.id,
          followingId: RAJNIKANT_USER_ID,
          createdAt: new Date(),
        });
        console.log(`✅ ${userData.username} is now following Rajnikant`);
      }
    }

    // Add some likes to Rajnikant's post
    const rajnikantPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, RAJNIKANT_USER_ID));

    if (rajnikantPosts.length > 0) {
      const firstPost = rajnikantPosts[0];
      
      for (const userData of sampleUsers) {
        const [existingLike] = await db
          .select()
          .from(likes)
          .where(eq(likes.userId, userData.id));

        if (!existingLike) {
          await db.insert(likes).values({
            userId: userData.id,
            postId: firstPost.id,
            createdAt: new Date(),
          });
        }
      }
      console.log("✅ Added likes to Rajnikant's post");
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
seedDatabase()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });

export { seedDatabase };