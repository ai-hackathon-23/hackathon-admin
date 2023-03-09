import axios, { AxiosResponse } from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 100000,
})

export interface BaseResponse {
  status: number
  detail?: string
}

export function createErrorResponse(error: AxiosResponse): BaseResponse {
  let data = ""

  if (error.data) {
    data = error.data
  }

  return {
    status: error.status,
    detail: data,
  }
}
