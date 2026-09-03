import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase/admin";

export async function GET() {
  try {
    const doc = await adminDb
      .collection("pengantin")
      .doc("FQrIYkP1Zoa80J85KodG")
      .get();

    console.log("Document exists:", doc.exists);

    return NextResponse.json({
      success: true,
      exists: doc.exists,
      data: doc.exists ? doc.data() : null,
    });
  } catch (error) {
    console.error("Firestore error FULL:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Firestore read failed",
      },
      { status: 500 }
    );
  }
}