import { AxiosResponse } from "axios"
import { api, BaseResponse, createErrorResponse } from "./api"
import { StateType } from "../types/state"

export interface StateResponse extends BaseResponse {
  data?: {
    state: StateType
  }
}

function createStateResponse(response: AxiosResponse): StateResponse {
  const state: StateType = {
    id: response.data.id,
    disease: response.data.disease,
    treatments: response.data.treatments,
    medicines: response.data.medicines,
    treatment_policy: response.data.treatment_policy,
    client_id: response.data.client_id,
  }

  return {
    status: response.status,
    data: { state },
  }
}

export function postState(
  disease: string,
  treatments: string,
  medicines: string,
  treatment_policy: string,
  client_id: number
): Promise<StateResponse> {
  const url = `/state`
  const req = {
    disease,
    treatments,
    medicines,
    treatment_policy,
    client_id,
  }
  var params = new URLSearchParams()
  params.append("disease", disease)
  params.append("treatments", treatments)
  params.append("medicines", medicines)
  params.append("treatment_policy", treatment_policy)
  params.append("client_id", client_id.toString())

  return api.post(url, params).then(function (response: AxiosResponse) {
    return createStateResponse(response)
  })
}
