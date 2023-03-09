import React, { useState, useEffect } from "react"
import { StatusCodes } from "http-status-codes"
import { ClientType } from "../../lib/types/client"
import { getClients } from "../../lib/api/client"

function Client(): JSX.Element {
  const [clients, setClients] = useState<ClientType[]>([])

  const getClientsFromApi = async () => {
    const res = await getClients()
    if (res.data) {
      setClients(res.data.clients)
    }
  }

  useEffect(() => {
    void getClientsFromApi()
  }, [])

  return (
    <>
      <div>
        <ul>
          {React.Children.toArray(
            clients.slice().map((clients: ClientType, index: number) => (
              <li key={index}>
                <li>
                  <p>{clients.id}</p>
                </li>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  )
}

export default Client
