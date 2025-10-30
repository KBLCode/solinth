/**
 * Test Supabase connection directly
 */

import { config } from "dotenv";
config();

import { createClient } from "@supabase/supabase-js";

async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    return;
  }

  console.log(`📡 Connecting to: ${supabaseUrl}`);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connection successful!");
      console.log("📊 Database is accessible");
    }

    // Test if we can create a simple table
    const { error: createError } = await supabase.rpc("version");
    if (createError) {
      console.error("❌ Database query failed:", createError.message);
    } else {
      console.log("✅ Database queries working");
    }
  } catch (error) {
    console.error("❌ Connection test failed:", error);
  }
}

testSupabaseConnection();
