import { AxiosResponse } from "axios"
import { api, BaseResponse, createErrorResponse } from "./api"
import { ClientType } from "../types/client"

export interface ClientsResponse extends BaseResponse {
  data?: {
    clients: ClientType[]
  }
}

function createClientResponse(response: AxiosResponse): ClientsResponse {
  const clients: ClientType[] = []
  for (let i = 0; i < response.data.length; i++) {
    clients.push({
      id: response.data[i].id,
      name: response.data[i].name,
      age: response.data[i].age,
      disese: response.data[i].disese,
      family_living_together: response.data[i].family_living_together,
    })
  }

  return {
    status: response.status,
    data: { clients },
  }
}

export function getClients(): Promise<ClientsResponse> {
  const url = "/clients"

  return api
    .get(url)
    .then(function (response: AxiosResponse) {
      return createClientResponse(response)
    })
    .catch(function (error: AxiosResponse) {
      console.log(error)
      return createErrorResponse(error)
    })
}
