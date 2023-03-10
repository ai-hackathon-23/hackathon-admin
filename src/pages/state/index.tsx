import React, { useState, useEffect, FormEventHandler, ChangeEvent } from "react"
import { StatusCodes } from "http-status-codes"
import { ClientType } from "../../lib/types/client"
import { getClients } from "../../lib/api/client"
import { postState } from "../../lib/api/state"
import Link from "next/link"

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
      <section className="main">
        <section className="left-block">
          <Link className="sidebar-block" href="/">
            利用者登録
          </Link>
        </section>
        <section className="right-block">
          <div>
          <table>
  <thead>
    <tr>
      <th></th>
      <th>ID</th>
      <th>名前</th>
      <th>年齢</th>
    </tr>
  </thead>
  <tbody>
  {clients.slice().map((client: ClientType, index: number) => (
    <tr key={index}>
      <td>          <input
            type="checkbox"
            name="client"
            value={client.id}
            checked={client.id === clientId}
            onChange={() => setClientId(client.id)}
          /></td>
      <td>
        <label>

          <span className="radio-label">{client.id}</span>
        </label>
      </td>
      <td>{client.name}</td>
      <td>{client.age}歳</td>
    </tr>
  ))}
</tbody>

</table>
          </div>

          <h2>病状登録</h2>
          <div className="form-block">
            <form onSubmit={handleSubmit}>
              <section className="form-section">
                <div>病名</div>
                <input
                  className=""
                  value={disease}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setDisease(event.target.value)}
                />
              </section>

              <section className="form-section">
                <div>処置名</div>
                <input
                  value={treatments}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setTreatments(event.target.value)}
                />
              </section>
              <section className="form-section">
                <div>処方薬</div>
                <input
                  value={medicines}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setMedicines(event.target.value)}
                />
              </section>
              <section className="form-section">
                <div>対応方針</div>
                <textarea
                  name="postContent"
                  value={treatmentPolicy}
                  onChange={(e) => setTreatmentPolicy(e.target.value)}
                  rows={4}
                  cols={40}
                />
              </section>
              <button className="button-default" type="submit">
                登録
              </button>
            </form>
          </div>
        </section>
      </section>
    </>
  )
}

export default State
