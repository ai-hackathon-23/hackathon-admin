import React, { useState, ChangeEvent, FormEventHandler } from "react"
import { If, Then } from "react-if"
import { StatusCodes } from "http-status-codes"
import { postClient } from "../../lib/api/client"
import Link from "next/link"
import { Button } from "react-admin"

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
    <section className="main">
      <section className="left-block">
        <Link className="sidebar-block" href="/state">
          病状登録
        </Link>
      </section>
      <section className="right-block">
        <h2>利用者登録</h2>
        <div className="form-block">
          <form onSubmit={handleSubmit}>
            <section className="form-section">
              <div>名前</div>
              <input
                value={name}
                placeholder="名前"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
              />
            </section>

            <section className="form-section">
              <div>年齢</div>
              <input
                value={age}
                placeholder="年齢"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setAge(Number(event.target.value))}
              />
            </section>

            <section className="form-section">
              <div>家族構成</div>
              <input
                value={familiyLivingTogether}
                placeholder="家族構成"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setFamilyLivingTogether(event.target.value)}
              />
            </section>
            <div>
              <If condition={message}>
                <Then>
                  <p>{message}</p>
                </Then>
              </If>
            </div>
            <button className="button-default" type="submit">
              登録
            </button>
          </form>
        </div>
      </section>
    </section>
  )
}

export default Client
