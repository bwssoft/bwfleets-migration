import { findManyMigrationAudit } from "@/@shared/actions/migration-audit.action";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://development:fC5dHxTAJx3NHfk3@cluster0.5bwzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

let client;
let bCubeClientPromise: Promise<MongoClient> | undefined;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _bCubeClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._bCubeClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._bCubeClientPromise = client.connect();
  }
  bCubeClientPromise = globalWithMongo._bCubeClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  bCubeClientPromise = client.connect();
}

export async function GET() {
  try {
    const response = await findManyMigrationAudit();
    const bfleetClient = await bCubeClientPromise;
    bfleetClient
      ?.db("b-fleet")
      .collection("client")
      .bulkWrite(
        response.map((i) => ({
          updateOne: {
            filter: {
              ww_account_id: i.accountId.toString(),
            },
            update: {
              $set: {
                child_count: i.isLeaf,
              },
            },
            upsert: true,
          },
        }))
      );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error?.message });
    }
  }
}
