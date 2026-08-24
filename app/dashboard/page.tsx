import Link from "next/link";
import React from "react";

const DashBoard = () => {
  return <div>
    Dashboard
    <Link href="/roadmaps" className="text-blue-600 underline">
      Go to Roadmaps
    </Link>
    
    </div>;
};

export default DashBoard;
