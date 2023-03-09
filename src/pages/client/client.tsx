import React, { useState, ChangeEvent, FormEventHandler } from "react"
import { If, Then } from "react-if"
import { StatusCodes } from "http-status-codes"
import { ClientType } from "../../lib/types/client"
import { getClients } from "../../lib/api/client"
import { postClient } from "../../lib/api/client"

function Client(): JSX.Element {
  const [name, setName] = useState<string>("")
  const [age, setAge] = useState<number>(0)
  const [familiyLivingTogether, setFamilyLivingTogether] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
    const result = await postClient(name, age, familiyLivingTogether)

    if (result.status === StatusCodes.OK) {
      setName("")
      setAge(0)
      setFamilyLivingTogether("")
      setMessage("登録しました。")
    } else {
      setName("")
      setAge(0)
      setFamilyLivingTogether("")
      setMessage("登録できませんでした。")
    }
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            placeholder="名前"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          />
          <input
            value={age}
            placeholder="年齢"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setAge(Number(event.target.value))}
          />
          <input
            value={familiyLivingTogether}
            placeholder="家族構成"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFamilyLivingTogether(event.target.value)}
          />
          <div>
            <If condition={message}>
              <Then>
                <p>{message}</p>
              </Then>
            </If>
          </div>
          <button type="submit">登録</button>
        </form>
      </div>
    </>
  )
}

export default Client
