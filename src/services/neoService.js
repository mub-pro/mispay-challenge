import AxiosInstance from "@/lib/axiosInstance"

const NeoService = {
  getNeoData: async () => {
    const response = await AxiosInstance.get('/neo/browse')

    return response.data
  }
}

export default NeoService