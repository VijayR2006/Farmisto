import { useEffect, useState } from "react";
import axios from "./axios";

const useMarketStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    axios.get("/market/stats")
      .then(({ data }) => {
        if (isMounted) setStats(data);
      })
      .catch((requestError) => {
        console.error("Failed to fetch marketplace statistics:", requestError);
        if (isMounted) setError("Marketplace statistics are unavailable.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading, error };
};

export default useMarketStats;
