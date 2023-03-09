import React, { useState, useEffect } from "react"
import { StatusCodes } from "http-status-codes"
import { ClientType } from "../../lib/types/client"
import { getClients } from "../../lib/api/client"

function CarePlan(): JSX.Element {
  const [clients, setClients] = useState<ClientType[]>([])

  const getClientsFromApi = async () => {
    const res = await getClients()
    if (res.status == StatusCodes.OK) {
      if (res.data) {
        setClients(res.data.clients)
      }
    }
  }

  useEffect(() => {
    void getClientsFromApi()
  }, [])

  return (
    <>
      <div>
        <table>
          {/* <thead>
            <p>Clients</p>
          </thead> */}
          {React.Children.toArray(
            clients.slice().map((clients: ClientType, index: number) => (
              <tr key={index}>
                <button>
                  <td>{clients.id}</td>
                  <td>{clients.name}</td>
                </button>
              </tr>
            ))
          )}
        </table>
      </div>
    </>
  )
}

export default CarePlan
