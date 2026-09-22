


import PlatformAuth from "@/components/dashboard/PlatFormAuth";
import PlatformLayoutClient from "@/components/dashboard/PlatFormLayoutClient";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformAuth>
    
        
          <PlatformLayoutClient>{children}</PlatformLayoutClient>
        </PlatformAuth>
     
  );
}
