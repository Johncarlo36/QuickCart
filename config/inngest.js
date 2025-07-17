import { Inngest } from "inngest";
import connectDB from "./db";
import User from "./models/User"; // ← make sure to import your User model

// Create a client to send and receive events
export const inngest = new Inngest({ id: "koby-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url, // destructured correctly
    } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url, // fixed variable name
    };

    // Connect to your MongoDB database
    await connectDB();

    // Create the user in MongoDB via Mongoose
    await User.create(userData);
  }
);

export const syncUserUpdation = inggest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url, // destructured correctly
    } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url, // fixed variable name
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

//Inggest Functionn to delete user data from a database

export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    // Connect to your MongoDB database
    await connectDB();

    // Delete the user from MongoDB via Mongoose
    await User.findByIdAndDelete(id);
  }
);
