import { AxiosResponse } from "axios"
import { api, BaseResponse, createErrorResponse } from "./api"
import { ClientType } from "../types/client"

export interface ClientsResponse extends BaseResponse {
  data?: {
    clients: ClientType[]
  }
}

function createClientsResponse(response: AxiosResponse): ClientsResponse {
  const clients: ClientType[] = []
  for (let i = 0; i < response.data.length; i++) {
    clients.push({
      id: response.data[i].id,
      name: response.data[i].name,
      age: response.data[i].age,
      family_living_togethers: response.data[i].family_living_togethers,
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
      return createClientsResponse(response)
    })
    .catch(function (error: AxiosResponse) {
      console.log(error)
      return createErrorResponse(error)
    })
}

export interface ClientResponse extends BaseResponse {
  data?: {
    client: ClientType
  }
}

function createClientResponse(response: AxiosResponse): ClientResponse {
  const client: ClientType = {
    id: response.data.id,
    name: response.data.name,
    age: response.data.age,
    family_living_togethers: response.data.family_living_togethers,
  }

  return {
    status: response.status,
    data: { client },
  }
}

export function postClient(name: string, age: number, family_living_togethers: string | null): Promise<ClientResponse> {
  const url = `/client`
  const req = {
    name,
    age,
    family_living_togethers,
  }
  var params = new URLSearchParams();
  params.append('name', name);
  params.append('age', age.toString());
  params.append('family_living_togethers', family_living_togethers ?? '')

  return api.post(url, params).catch(function (error: AxiosResponse) {
    console.log(error)
    return createErrorResponse(error)
  })
}
