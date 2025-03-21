'use client'

import { getData } from "@/utils/apiService";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [text, setText] = useState<boolean>(false);
  const getTestData = async() => {
    try {
      const response = await getData({ 
          endpoint: `/auth/login`
      }) as any;
      if (response.success) setText(true);
      
    } 
    catch {}
  }

  
  useEffect(() => {
    getTestData();    
  }, [])
  return (
    <div className="w-fit mx-auto my-auto text-3xl font-bold text-green-600">
       { text }
    </div>
  );
}
