import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/supabase";

export const useRealtimeBoards = () => {
  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boards" },
        () => {
          // Khi có thay đổi ở DB, yêu cầu TanStack Query tải lại dữ liệu
          queryClient.invalidateQueries({ queryKey: ["boards"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
