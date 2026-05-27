import api from "./api";

// GET APPLICATIONS FOR A JOB
export const getApplications = async (jobId) => {
  const res = await api.get(`/applications/${jobId}`);

  return res.data;
};
