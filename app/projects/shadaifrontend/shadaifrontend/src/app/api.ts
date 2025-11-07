import axios from "axios"


const api = axios.create({
  baseURL:"http://localhost:8000"
})


export  const getAIRepsonse = async(prompt: string) => {
  try{
    const response = await api.get(`/get/response/${encodeURIComponent(prompt)}`);
    return response.data
  }catch(error){
    console.log(error)
  }
}