import React, { useState, useEffect, FormEventHandler, ChangeEvent } from "react"
import { StatusCodes } from "http-status-codes"
import { ClientType } from "../../lib/types/client"
import { getClients } from "../../lib/api/client"
import { postState } from "../../lib/api/state"

function State(): JSX.Element {
  const [clients, setClients] = useState<ClientType[]>([])
  const [disease, setDisease] = useState<string>("")
  const [treatments, setTreatments] = useState<string>("")
  const [medicines, setMedicines] = useState<string>("")
  const [treatmentPolicy, setTreatmentPolicy] = useState<string>("")
  const [clientId, setClientId] = useState<number>(0)

  const getClientsFromApi = async () => {
    const res = await getClients()
    if (res.status == StatusCodes.OK) {
      if (res.data) {
        setClients(res.data.clients)
      }
    }
  }

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault()

    const result = await postState(disease, treatments, medicines, treatmentPolicy, clientId)

    setDisease("")
    setTreatments("")
    setMedicines("")
    setTreatmentPolicy("")
    setClientId(0)
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
                <button onClick={() => setClientId(clients.id)}>
                  <td>{clients.id}</td>
                  <td>{clients.name}</td>
                </button>
              </tr>
            ))
          )}
        </table>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <section>
            <div>病名</div>
            <input
              className=""
              value={disease}
              placeholder="病名"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDisease(event.target.value)}
            />
          </section>

          <section>
            <div>処置名</div>
            <input
              value={treatments}
              placeholder="行った処置"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setTreatments(event.target.value)}
            />
          </section>
          <section>
            <div>処方薬</div>
            <input
              value={medicines}
              placeholder="処方した薬"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setMedicines(event.target.value)}
            />
          </section>
          <section>
            <div>対応方針</div>
            <input
              value={treatmentPolicy}
              placeholder="対応方針"
              onChange={(event: ChangeEvent<HTMLInputElement>) => setTreatmentPolicy(event.target.value)}
            />
          </section>
          <button type="submit">登録</button>
        </form>
      </div>
    </>
  )
}

export default State
