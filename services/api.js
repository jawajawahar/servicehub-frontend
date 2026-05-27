import axios from "axios";

const api = axios.create({
  baseURL: "process.env.NEXT_PUBLIC_SOCKET_URL/api",
});

// AUTO ATTACH TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // ===================================
      // FETCH HEALTH
      // ===================================
      const fetchHealth = async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/health`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setHealth(res.data);
        } catch (error) {
          console.log("HEALTH ERROR:", error);
        } finally {
          setLoading(false);
        }
      };

      // ===================================
      // SOCKET CONNECTION
      // ===================================
      useEffect(() => {
        fetchHealth();

        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
          transports: ["websocket"],
        });

        // JOIN ADMIN ROOM
        socket.emit("joinAdminRoom");

        // LIVE UPDATES
        socket.on("platformHealthUpdate", (data) => {
          setHealth((prev) => {
            if (!prev) return prev;

            return {
              ...prev,

              users: {
                ...prev.users,

                active: data.activeUsers ?? prev.users.active,
              },

              jobs: {
                ...prev.jobs,

                open: data.openJobs ?? prev.jobs.open,

                inProgress: data.inProgressJobs ?? prev.jobs.inProgress,

                completed: data.completedJobs ?? prev.jobs.completed,
              },

              reports: {
                ...prev.reports,

                open: data.openReports ?? prev.reports.open,
              },
            };
          });
        });

        // CLEANUP
        return () => {
          if (socket) {
            socket.disconnect();
          }
        };
      }, []);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

export default api;
